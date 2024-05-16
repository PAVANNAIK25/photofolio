import styles from "./imageList.module.css";
import { useState, useRef, useEffect } from "react";
import Spinner from "react-spinner-material";
import { ImageForm } from "../imageForm/ImageForm";
import { Carousel } from "../carousel/Carousel";
import { onSnapshot, collection, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";


export const ImagesList = ({ albumName, onBack }) => {
  //These state and functions are create just for your convience you can create modify or delete the state as per your requirement.
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchIntent, setSearchIntent] = useState(false);
  const searchInput = useRef();
  const [addImageIntent, setAddImageIntent] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [updateImageIntent, setUpdateImageIntent] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [activeHoverImageIndex, setActiveHoverImageIndex] = useState(null);

  
  

  // async function gets images from DB in real time
  const getImages = async () => {
    setLoading(true);
    setImgLoading(true);
    try {
      const unsub = onSnapshot(collection(db, `/albums/${albumName.id}/images/`), (snap) => {
        const imageData = snap.docs.map((image) => {
          return {
            id: image.id,
            ...image.data()
          }

        })
        setImages(imageData);
      })
      return unsub;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setImgLoading(false);
    }
  };

  // this will get the images on mounting
  useEffect(() => {
    getImages();
  }, [])

  // function to handle toggle next image
  const handleNext = () => {
    if (activeImageIndex + 1 < images.length) {
      setActiveImageIndex(prev => prev + 1);
    }

  };

  // function to handle toggle previous image
  const handlePrev = () => {
    if (activeImageIndex - 1 >= 0) {
      setActiveImageIndex(activeImageIndex - 1);
    }
  };
  // function to handle cancel  
  const handleCancel = () => {
    setActiveImageIndex(null);
  };

  // function to handle search functionality for image
  const handleSearchClick = () => {
    setSearchIntent(prev => !prev);

  };

  // function to handle search functionality for image
  const handleSearch = async () => {
    const searchQuery = searchInput.current?.value;

    if(searchQuery === ""){
      return setImages(images);
    }

    const filterBySearch = images.filter((img)=> {
      return img.title.toLowerCase().includes(searchQuery);
    })

    setImages(filterBySearch);
  };
  

  // async functions
  const handleAddImage = async (title, imageUrl) => {
    setLoading(true);
    setImgLoading(true);
    try {
      const imgRef = await addDoc(collection(db, `/albums/${albumName.id}/images/`), {
        title,
        url: imageUrl
      })
      setImages([{ id: imgRef.id, title, url: imageUrl }, ...images]);
      toast.success("Image added successfully!");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setImgLoading(false);
    }
  };

  // function to handle update image
  const handleUpdate = async ({ title, url, id }) => {
    setLoading(true);
    setImgLoading(true);
    try {
      await setDoc(doc(db, `/albums/${albumName.id}/images/`, id), {
        title,
        url
      })

      const index = images.map((img) => {
        return img.id;
      }).indexOf(id);

      const temp = [...images];
      temp[index] = {
        id,
        title,
        url
      }
      setImages(temp);
      toast.success("Image updated successfully!");

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setImgLoading(false);
    }

  };

  // function to handle delete image
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deleteDoc(doc(db, `/albums/${albumName.id}/images/`, id));
      setImages(images.filter((img) => id !==
        img.id));

      toast.success("Image deleted successfully");

    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };

  if (!images.length && !searchInput.current?.value && !loading) {
    return (
      <>
        <div className={styles.top}>
          <span onClick={onBack}>
            <img src="/assets/back.png" alt="back" />
          </span>
          <h3>No images found in the album.</h3>
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        </div>
        {addImageIntent && (
          <ImageForm
            loading={imgLoading}
            onAdd={handleAddImage}
            albumName={albumName}
          />
        )}
      </>
    );
  }
  return (
    <>
      {(addImageIntent || updateImageIntent) && (
        <ImageForm
          loading={imgLoading}
          onAdd={handleAddImage}
          albumName={albumName}
          onUpdate={handleUpdate}
          updateIntent={updateImageIntent}
        />
      )}
      {(activeImageIndex || activeImageIndex === 0) && (
        <Carousel
          title={images[activeImageIndex].title}
          url={images[activeImageIndex].url}
          onNext={handleNext}
          onPrev={handlePrev}
          onCancel={handleCancel}
        />
      )}
      <div className={styles.top}>
        <span onClick={onBack}>
          <img src="/assets/back.png" alt="back" />
        </span>
        <h3>Images in {albumName.title}</h3>

        <div className={styles.search}>
          {searchIntent && (
            <input
              placeholder="Search..."
              onChange={handleSearch}
              ref={searchInput}
              autoFocus={true}
            />
          )}
          <img
            onClick={handleSearchClick}
            src={!searchIntent ? "/assets/search.png" : "/assets/clear.png"}
            alt="clear"
          />
        </div>
        {updateImageIntent && (
          <button
            className={styles.active}
            onClick={() => setUpdateImageIntent(false)}
          >
            Cancel
          </button>
        )}
        {!updateImageIntent && (
          <button
            className={`${addImageIntent && styles.active}`}
            onClick={() => setAddImageIntent(!addImageIntent)}
          >
            {!addImageIntent ? "Add image" : "Cancel"}
          </button>
        )}
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}
      {!loading && (
        <div className={styles.imageList}>
          {images.map((image, i) => (
            <div
              key={image.id}
              className={styles.image}
              onMouseOver={() => setActiveHoverImageIndex(i)}
              onMouseOut={() => setActiveHoverImageIndex(null)}
              onClick={() => setActiveImageIndex(i)}
            >
              <div
                className={`${styles.update} ${activeHoverImageIndex === i && styles.active
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateImageIntent(image);
                }}
              >
                <img src="/assets/edit.png" alt="update" />
              </div>
              <div
                className={`${styles.delete} ${activeHoverImageIndex === i && styles.active
                  }`}
                onClick={(e) => handleDelete(e, image.id)}
              >
                <img src="/assets/trash-bin.png" alt="delete" />
              </div>
              <img
                src={image.url}
                alt={image.title}
                onError={({ currentTarget }) => {
                  console.log("inside error");
                  currentTarget.src = "/assets/warning.png";
                }}
              />
              <span>{image.title?.substring(0, 20)}</span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
