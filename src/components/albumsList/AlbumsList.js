import { addDoc, collection, onSnapshot } from "firebase/firestore";
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

  //Creates new album and appends to list 
  const addNewAlbumToList = async (albumName) => {

    const docRef = await addDoc(collection(db, "albums"), {
      title: albumName
    })
    setAlbums([{
      id: docRef.id,
      title: albumName
    }, ...albums]);
    toast.success("Album added successfully!");
  }

  const handleAlbumClick = async (album) => {
    setShowImageList(album);
  }

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
          loading={loading} />
      </div> : null}
      
      <div className={styles.top}>
        <h3>Your Albums</h3>
        <button className={showAlbumForm ? styles.active : null} onClick={handleAddAlbum}>{showAlbumForm ? "Cancel" : "Add album"}</button>
      </div>
    {loading && (
      <div className={styles.loader}>
        <Spinner color="#0077ff"/>  
      </div>
    )}
    {!loading && (<div className={styles.albumsList}>
        {albums.map((album, index) => (
          <div className={styles.album} key={index} onClick={() => handleAlbumClick(album)}>
            <img src="./assets/photos.png" alt="album_baner" />
            <span>{album.title}</span>
          </div>
        ))}
      </div>)}

    </>
  )
};
