import { useEffect, useRef } from 'react';
import styles from './DataMatrix.module.scss';

const CELL_SIZE = 20;
const ROW_COUNT = 15;
const CELLS_TO_CLEAR_PER_FRAME = 20;
const CELLS_TO_ANIMATE_PER_FRAME = 15;

const DataMatrix = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cells: HTMLDivElement[] = [];
    let animationId: ReturnType<typeof setTimeout>;

    const buildCells = () => {
      cells.forEach((cell) => cell.remove());
      cells = [];

      const columns = Math.floor(window.innerWidth / CELL_SIZE);
      const totalCells = columns * ROW_COUNT;

      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.className = styles.cell;
        container.appendChild(cell);
        cells.push(cell);
      }
    };

    const animate = () => {
      if (cells.length === 0) {
        animationId = setTimeout(animate, 200);
        return;
      }

      for (let i = 0; i < CELLS_TO_CLEAR_PER_FRAME; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        cell.style.opacity = '0';
        cell.style.background = 'transparent';
      }

      for (let i = 0; i < CELLS_TO_ANIMATE_PER_FRAME; i++) {
        const cell = cells[Math.floor(Math.random() * cells.length)];
        const rand = Math.random();

        cell.style.opacity = String(Math.random() * 0.8 + 0.2);

        if (rand > 0.98) {
          cell.style.background = 'var(--dm-danger)';
        } else if (rand > 0.8) {
          cell.style.background = 'var(--dm-accent)';
        } else {
          cell.style.background = 'var(--dm-dark)';
        }
      }

      animationId = setTimeout(animate, 200);
    };

    buildCells();
    animate();

    const onResize = () => buildCells();
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(animationId);
      window.removeEventListener('resize', onResize);
      cells.forEach((cell) => cell.remove());
    };
  }, []);

  return <div ref={containerRef} className={styles.matrix} />;
};

export default DataMatrix;
