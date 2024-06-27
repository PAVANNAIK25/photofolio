import styles from "./albumForm.module.css";
import { useEffect, useRef } from "react";

export const AlbumForm = ({loading, addNewAlbum, updateAlbum, updateAlbumName }) => {
  
  const albumNameInput = useRef();

// function  to handle the clearing of the form
  const handleClear = () =>{
    clearForm();
  };

  useEffect(()=>{
    if(updateAlbum){
      albumNameInput.current.value = updateAlbum.title;
    }
  }, [updateAlbum])

// function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if(updateAlbum){
      const albumName = albumNameInput.current.value;
      updateAlbumName(albumName, updateAlbum.id);
    }else{
      const albumName = albumNameInput.current.value;
      addNewAlbum(albumName);
    }
    // clearForm();
  };

  const clearForm = ()=>{
    albumNameInput.current.value="";
  }

  return (
    <div className={styles.albumForm}>
      <span>Create an album</span>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Album Name" ref={albumNameInput} />
        <button type="button" onClick={handleClear} disabled={loading}>
          Clear
        </button>
        <button disabled={loading}>{updateAlbum? "Update":"Create"}</button>
      </form>
    </div>
  );
};
