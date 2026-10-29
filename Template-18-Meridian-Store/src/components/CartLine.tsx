import { Link } from 'react-router-dom';
import type { PricedLine } from '../lib/pricing';
import { galleryFor } from '../lib/catalog';
import { formatMoney } from '../lib/money';
import { changeQty, removeItem } from '../state/actions';
import { useUI } from '../state/ui';
import { Icon } from './Icon';
import { QtyStepper, SafeImg } from './ui';

/** One line of the bag, shared by the slide-out cart and the full cart page. */
export function CartLine({ line, onNavigate }: { line: PricedLine; onNavigate?: () => void }) {
  const { announce } = useUI();
  const { product, variant } = line;
  if (!product || !variant) {
    return (
      <li className="cart-line has-issue">
        <div className="cart-line-body">
          <p className="cart-line-name">This item is no longer available</p>
          <button type="button" className="text-btn" onClick={() => { removeItem(line.key); announce('Unavailable item removed from your bag.'); }}>Remove</button>
        </div>
      </li>
    );
  }
  const img = galleryFor(product, variant.options)[0];
  const name = `${product.name}${variant.label ? `, ${variant.label}` : ''}`;
  const issue = line.issue === 'sold-out' ? 'Sold out — remove this item to continue.' : line.issue === 'insufficient-stock' ? `Only ${variant.stock} available — reduce the quantity to continue.` : line.issue === 'unavailable' ? 'No longer available.' : '';
  return (
    <li className={`cart-line${issue ? ' has-issue' : ''}`}>
      <Link to={`/products/${product.slug}`} className="cart-line-img" onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <SafeImg src={img?.src ?? ''} alt="" width={160} height={200} />
      </Link>
      <div className="cart-line-body">
        <div className="cart-line-top">
          <div>
            <p className="cart-line-name"><Link to={`/products/${product.slug}`} onClick={onNavigate}>{product.name}</Link></p>
            {variant.label && <p className="cart-line-variant">{variant.label}</p>}
            <p className="cart-line-unit">{formatMoney(line.unitMinor, { currency: product.currency })}{line.compareAtMinor ? <s> {formatMoney(line.compareAtMinor, { currency: product.currency })}</s> : null}</p>
          </div>
          <p className="cart-line-total" aria-label={`Line total ${formatMoney(line.lineMinor, { currency: product.currency })}`}>{formatMoney(line.lineMinor, { currency: product.currency })}</p>
        </div>
        {issue && <p className="line-issue" role="alert">{issue}</p>}
        <div className="cart-line-actions">
          {line.issue !== 'sold-out' && line.issue !== 'unavailable' && (
            <QtyStepper
              value={line.qty} max={Math.max(1, line.maxQty)} label={name}
              onChange={(n) => {
                const { capped } = changeQty(line.key, n);
                announce(n < 1 ? `${name} removed from your bag.` : capped ? `Only ${line.maxQty} of ${name} can be ordered. Quantity set to ${line.maxQty}.` : `Quantity of ${name} updated to ${n}.`);
              }}
            />
          )}
          <button type="button" className="text-btn" onClick={() => { removeItem(line.key); announce(`${name} removed from your bag.`); }} aria-label={`Remove ${name} from bag`}>
            <Icon name="trash" size={16} /> Remove
          </button>
        </div>
      </div>
    </li>
  );
}
