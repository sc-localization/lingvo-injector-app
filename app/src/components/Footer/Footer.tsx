import styles from './Footer.module.scss';
import communityLogo from '../../assets/community-logo.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <a
          href="https://github.com/sc-localization/lingvo-injector-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          GITHUB
        </a>
        {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
        <a href="#" target="_blank" rel="noopener noreferrer">
          DISCORD
        </a>
        {/*eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
        <a href="#" target="_blank" rel="noopener noreferrer">
          WEBSITE
        </a>
      </div>

      <img src={communityLogo} className={styles.watermark} alt="watermark" />

      <p className={styles.disclaimer}>
        This is an unofficial Star Citizen fan localisation, not affiliated with
        the Cloud Imperium group of companies. Star Citizen®, Roberts Space
        Industries® and Cloud Imperium® are registered trademarks of Cloud
        Imperium Rights LLC.
      </p>
    </footer>
  );
};

export default Footer;
