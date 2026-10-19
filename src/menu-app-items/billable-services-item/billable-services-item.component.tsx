import React from 'react';
import styles from '../item.scss';
import { Receipt } from '@carbon/react/icons';
import Item from '../item.component';

const BillableServicesItem = () => {
  return <Item className={styles.customTile} title="Billable Services" to="billable-services" icon={Receipt} />;
};

export default BillableServicesItem;
