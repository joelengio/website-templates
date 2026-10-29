import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { site } from '../config/site';
import { formatMoney } from '../lib/money';
import { useCartPricing } from '../state/hooks';
import { useUI } from '../state/ui';
import { CartLine } from './CartLine';
import { DemoNotice, EmptyState } from './ui';
import { Icon } from './Icon';
import { useDialog } from './useDialog';

export function FreeShippingBar({ totals }: { totals: ReturnType<typeof useCartPricing>['totals'] }) {
  const t = totals.freeShipping;
  if (t.thresholdMinor === undefined || totals.itemCount === 0) return null;
  const pct = Math.min(100, Math.round((totals.discountedSubtotalMinor / t.thresholdMinor) * 100));
  return (
    <div className="ship-bar">
      <p>{t.qualified ? <><Icon name="check" size={16} /> {site.labels.freeShippingMessage}</> : <>You are <strong>{formatMoney(t.remainingMinor)}</strong> away from free standard shipping</>}</p>
      <div className="ship-track" role="progressbar" aria-label="Progress to free shipping" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { lines, totals } = useCartPricing();
  const close = () => setCartOpen(false);
  useDialog(cartOpen, close, ref);
  if (!cartOpen) return null;
  const go = (to: string) => { close(); navigate(to); };
  return (
    <div className="drawer-root" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div ref={ref} className="drawer drawer-right" role="dialog" aria-modal="true" aria-labelledby="cart-drawer-title" tabIndex={-1}>
        <div className="drawer-head">
          <h2 id="cart-drawer-title" className="h3">{site.labels.cart} <span className="count">({totals.itemCount})</span></h2>
          <button type="button" className="icon-btn" onClick={close} aria-label="Close bag" data-autofocus><Icon name="close" /></button>
        </div>
        {lines.length === 0 ? (
          <div className="drawer-body">
            <EmptyState title="Your bag is empty" text="Add something you love — your bag is saved in this browser." actions={<button type="button" className="btn" onClick={() => go('/shop')}>Continue shopping</button>} />
          </div>
        ) : (
          <>
            <div className="drawer-body">
              <FreeShippingBar totals={totals} />
              <ul className="cart-lines">{lines.map((l) => <CartLine key={l.key} line={l} onNavigate={close} />)}</ul>
            </div>
            <div className="drawer-foot">
              <div className="drawer-subtotal"><span>Subtotal</span><strong>{formatMoney(totals.subtotalMinor)}</strong></div>
              <p className="fine">Shipping, taxes and promo codes are calculated in your bag and at checkout.</p>
              <DemoNotice compact />
              <div className="drawer-actions">
                <Link to="/cart" className="btn btn-outline" onClick={close}>View bag</Link>
                <button type="button" className="btn" onClick={() => go('/checkout')} disabled={totals.hasIssues}>{site.labels.checkout}</button>
              </div>
              {totals.hasIssues && <p className="field-error" role="alert">Some items are unavailable. Review your bag to continue.</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
