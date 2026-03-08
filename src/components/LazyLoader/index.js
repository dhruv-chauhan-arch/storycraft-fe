import React from "react";
import styles from "./LazyLoader.module.scss";
import HashLoader from "react-spinners/HashLoader";

const LazyLoader = () => {
  return (
    <div className={styles.loaderDiv}>
      <HashLoader
        color={"#000"}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LazyLoader;
