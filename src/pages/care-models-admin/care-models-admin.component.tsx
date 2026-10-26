import React from 'react';
import { useTranslation } from 'react-i18next';
import { ModelAlt } from '@carbon/react/icons';
import styles from './root.scss';

const CareModelsAdmin: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{t('careModels', 'Care Models')}</h2>
        <p>
          {t(
            'careModelsDesc',
            'Manage care model definitions and configurations',
          )}
        </p>
      </div>
      <div className={styles.placeholder}>
        <ModelAlt size={48} />
        <h3>{t('comingSoon', 'Coming soon')}</h3>
        <p>{t('careModelsPlaceholderDesc', 'This page is under construction.')}</p>
      </div>
    </div>
  );
};

export default CareModelsAdmin;
