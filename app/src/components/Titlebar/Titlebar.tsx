import { getCurrentWindow } from '@tauri-apps/api/window';
import styles from './Titlebar.module.scss';

const Titlebar = () => {
  const appWindow = getCurrentWindow();

  return (
    <div className={styles.titlebar} data-tauri-drag-region>
      <div className={styles.title} data-tauri-drag-region />
      <div className={styles.controls}>
        <button
          className={styles.controlBtn}
          onClick={() => appWindow.minimize()}
          title="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <rect fill="currentColor" width="10" height="1" />
          </svg>
        </button>
        <button
          className={`${styles.controlBtn} ${styles.close}`}
          onClick={() => appWindow.close()}
          title="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              fill="currentColor"
              d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Titlebar;
