import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../firebase";
import styles from "../albumsList/albumsList.module.css"
import { AlbumForm } from "../albumForm/AlbumForm";
import { toast } from "react-toastify";
import { ImagesList } from "../imagesList/ImagesList";
import Spinner from "react-spinner-material";

export const AlbumsList = () => {
  //These state are create just for your convience you can create modify or delete the state as per your requirement.

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImageList, setShowImageList] = useState(null);
  const [albumAddLoading, setAlbumAddLoading] = useState(false);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [activeHoverAlbumIndex, setActiveHoverAlbumIndex] = useState(null);
  const [updateAlbumIntent, setUpdateAlbumIntent] = useState(null);


  // create function to get all the album from the firebase.
  useEffect(() => {
    getAlbumList();
  }, [])

  // function to get all data from firebase in realtime
  async function getAlbumList() {
    setLoading(true);
    try {
      const unsub = onSnapshot(collection(db, "albums"), (snapShot) => {
        const data = snapShot.docs.map((album) => {
          return {
            id: album.id,
            ...album.data()
          }
        })
        setAlbums(data);
      });

      return unsub;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  // create function to handle adding of the album
  const handleAddAlbum = () => {
    setShowAlbumForm((prev) => !prev);

  }

  const updateAlbumName = async (name, id) =>{
    try {
      setAlbumAddLoading(true);
      const docRef = doc(db, "albums", id);
      const result = await setDoc(docRef, {
        title: name
      });
      setShowAlbumForm(false);
      setUpdateAlbumIntent(null);
      toast.success("Album name updated successfully");
    } catch (error) {
      console.log(error);
    }finally{
      setAlbumAddLoading(false);
    }
  }

  //Creates new album and appends to list 
  const addNewAlbumToList = async (albumName) => {
    try {
      setAlbumAddLoading(true);
      const docRef = await addDoc(collection(db, "albums"), {
        title: albumName
      })
      toast.success("Album added successfully!");
      setShowAlbumForm(false);
    } catch (error) {
      console.log(error);
    } finally {
      setAlbumAddLoading(false);
    }
  }

  const updateAlbum = (album) => {
    setUpdateAlbumIntent(album);
    setShowAlbumForm(true);
  }

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const docRef = doc(db, "albums", id);
      await deleteDoc(docRef);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  }

  //handle click on specific album
  const handleAlbumClick = async (album) => {
    setShowImageList(album);
  }

  // handle back button on imagelist
  const handleClickOnBack = () => {
    setShowImageList(null);
  }

  if (showImageList) {
    return (
      <ImagesList albumName={showImageList} onBack={handleClickOnBack} />
    )
  }

  return (
    <>
      {showAlbumForm ? <div>
        <AlbumForm addNewAlbum={addNewAlbumToList}
          loading={albumAddLoading} updateAlbum={updateAlbumIntent} updateAlbumName = {updateAlbumName}/>
      </div> : null}

      <div className={styles.top}>
        <h3>Your Albums</h3>
        <button className={showAlbumForm ? styles.active : null} onClick={handleAddAlbum}>{showAlbumForm ? "Cancel" : "Add album"}</button>
      </div>
      {loading && (
        <div className={styles.loader}>
          <Spinner color="#0077ff" />
        </div>
      )}

      {!loading && (<div className={styles.albumsList}>
        {albums.map((album, index) => (
          <div className={styles.album} key={index} onMouseOver={() => setActiveHoverAlbumIndex(index)} onMouseOut={() => setActiveHoverAlbumIndex(null)} onClick={() => handleAlbumClick(album)}>

            <div className={`${styles.update} ${activeHoverAlbumIndex === index && styles.active
              }`}
              onClick={(e) => {
                e.stopPropagation();
                updateAlbum(album);
              }}
            >
              <img src="/assets/edit.png" alt="update" />
            </div>
            <div
              className={`${styles.delete} ${activeHoverAlbumIndex === index && styles.active
                }`}
              onClick={(e) => handleDelete(e, album.id)}
            >
              <img src="/assets/trash-bin.png" alt="delete" />
            </div>

            <img src="./assets/photos.png" alt="album_baner" />
            <span>{album.title}</span>
          </div>
        ))}
      </div>)}

    </>
  )
};
