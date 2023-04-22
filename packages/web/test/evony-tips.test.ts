import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import type { EvonyTips } from '../src/evony-tips.js';
import '../src/evony-tips.js';

describe('EvonyTips', () => {
  let element: EvonyTips;
  beforeEach(async () => {
    element = await fixture(html`<evony-tips></evony-tips>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
