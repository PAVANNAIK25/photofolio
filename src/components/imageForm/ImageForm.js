import styles from "./imageForm.module.css";
import { useEffect, useRef } from "react";

export const ImageForm = ({ albumName, loading, updateIntent, onAdd, onUpdate }) => {

  //These state are create just for your convience you can create modify or delete the state as per your requirement.
  const imageTitleInput = useRef();
  const imageUrlInput = useRef();

  useEffect(()=>{
    handleDefaultValues();
  });

  // function to handle image form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!updateIntent){
      onAdd(imageTitleInput.current.value, imageUrlInput.current.value);
    }else{
      const updateContent = {
        id: updateIntent.id,
        title:imageTitleInput.current.value,
        url:imageUrlInput.current.value
      }
      onUpdate(updateContent);
    }
    handleClear();
  };

  // function to thandle clearing the form
  const handleClear = () => {
    imageTitleInput.current.value = "";
    imageUrlInput.current.value = "";
  };

  // function to prefill the value of the form input 
  const handleDefaultValues = () => {
    if(updateIntent){
      imageTitleInput.current.value = updateIntent.title;
      imageUrlInput.current.value = updateIntent.url;
    }
  };

  return (
    <div className={styles.imageForm}>
      <span>
        {!updateIntent
          ? `Add image to ${albumName.title}`
          : `Update image ${updateIntent.title}`}
      </span>

      <form onSubmit={handleSubmit}>
        <input required placeholder="Title" ref={imageTitleInput} />
        <input required placeholder="Image URL" ref={imageUrlInput} />
        <div className={styles.actions}>
          <button type="button" onClick={handleClear} disabled={loading}>
            Clear
          </button>
          <button disabled={loading}>Add</button>
        </div>
      </form>
    </div>
  );
};
