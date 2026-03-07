import styles from './BackgroundEffects.module.scss';
import DataMatrix from '../DataMatrix/DataMatrix';

const BackgroundEffects = () => {
  return (
    <>
      <div className={styles.crossGrid} />
      <DataMatrix />
      <div className={styles.scanlines} />
      <div className={styles.crtOverlay} />
    </>
  );
};

export default BackgroundEffects;
