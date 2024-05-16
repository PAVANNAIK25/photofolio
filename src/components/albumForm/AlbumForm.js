import styles from "./albumForm.module.css";
import { useRef } from "react";

export const AlbumForm = ({loading, addNewAlbum }) => {
  const albumNameInput = useRef();
// function  to handle the clearing of the form
  const handleClear = () =>{
    clearForm();
  };
// function to handle the form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const albumName = albumNameInput.current.value;
    addNewAlbum(albumName);
    clearForm();
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
        <button disabled={loading}>Create</button>
      </form>
    </div>
  );
};
