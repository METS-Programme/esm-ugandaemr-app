import { ClickableTile } from '@carbon/react';
import React from 'react';
import { type CarbonIconType } from '@carbon/react/icons';

interface ItemTileProps {
  title: string;
  icon: CarbonIconType;
  to?: string;
  href?: string;
  className?: string;
  iconSize?: number | string;
}

const Item: React.FC<ItemTileProps> = ({ title, icon: Icon, to, className, iconSize = 24, href }) => {
  // items
  const base =
    typeof window !== 'undefined' && typeof window.getOpenmrsSpaBase === 'function' ? window.getOpenmrsSpaBase() : '/';
  const finalHref = href ?? `${base}${to ?? ''}`;
  const itemId = `menu-item-${title?.toLowerCase().replace(/\s+/g, '-') ?? 'untitled'}`;

  return (
    <ClickableTile className={className} id={itemId} href={`${finalHref}`}>
      <div className="customTileTitle">{<Icon size={iconSize} />}</div>
      <div>{title}</div>
    </ClickableTile>
  );
};
export default Item;
