import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";
import { HOME } from "../constants";
import NotFoundGif from "../../../assets/extras/notFound.gif";

const NotFound = () => {
  return (
    <div className={styles.notFoundMainDiv}>
      <img src={NotFoundGif} alt="404 Not Found" className={styles.img} />
      <div>
        <span>Go to </span>
        <Link to={HOME}>Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
