import { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../stores/RootStore';
import styles from './Terminal.module.scss';
import Typography from '../Typography/Typography';

const Terminal = observer(() => {
  const { uiStore } = useStores();
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [uiStore.logEntries.length]);

  const isBusy =
    uiStore.isCheckingUpdates || uiStore.isCheckingTranslationUpdates;

  return (
    <div className={styles.terminal}>
      <div className={styles.header}>
        <Typography variant="body" color="accent">
          SYS.LOG
        </Typography>
        <Typography variant="body" color="dim">
          SCAN: {isBusy ? 'ACTIVE...' : 'IDLE'}
        </Typography>
      </div>
      <div ref={contentRef} className={styles.content}>
        {uiStore.logEntries.map((entry, i) => (
          <div
            key={i}
            className={`${styles.entry} ${styles[entry.type] || ''}`}
          >
            {/* Try to translate the key, if not a key, show as is */}
            {t(entry.text, { defaultValue: entry.text })}
          </div>
        ))}
      </div>
      <div className={styles.footer}>
        AWAITING_CMD <span className={styles.cursor} />
      </div>
    </div>
  );
});

export default Terminal;
