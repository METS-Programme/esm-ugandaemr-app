import React from 'react';
import styles from '../item.scss';
import { ModelAlt } from '@carbon/react/icons';
import Item from '../item.component';

const CareModelsAdminApp = () => {
  return <Item className={styles.customTile} title="Care Models" to="care-models-admin" icon={ModelAlt} />;
};

export default CareModelsAdminApp;
