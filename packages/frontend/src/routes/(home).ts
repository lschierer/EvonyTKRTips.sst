import { defineRoute } from '@gracile/gracile/route';
import { html } from '@gracile/gracile/server-html';

import { document } from '../document.js';

import { card } from '../partials/card';
import { cardGrid } from '../partials/cardGrid.js';

const generalsCard = card({
  title: 'Generals',
  iconifyIcon: {
    name: 'hugeicons:user-star-01',
    width: '2rem',
    height: '2rem',
  },
  description: 'Tips and tools for picking the best generals',
  link: '/generals/',
});
const monstersCard = card({
  title: 'Monsters',
  link: '/monsters/',
  description:
    'Tips about hunting monsters and example reports from those who used them.',
  iconifyIcon: {
    name: 'hugeicons:monster',
    width: '2rem',
    height: '2rem',
  },
});

const svsCard = card({
  title: 'SvS',
  link: '/svs/',
  description: 'Tips for those seeking to participate in SvS and Battlefield',
  iconifyIcon: {
    name: 'mdi:sword-fight',
    width: '2rem',
    height: '2rem',
  },
});

const referenceCard = card({
  title: 'Reference',
  link: '/reference/',
  description: 'Reference material to help the rest make sense',
  iconifyIcon: {
    name: 'lucide:book-open-text',
    width: '2rem',
    height: '2rem',
  },
});

const sectionGrid = cardGrid([
  generalsCard,
  monstersCard,
  svsCard,
  referenceCard,
]);

export default defineRoute({
  document: (context) => document({ ...context, title: 'Evony TKR Tips' }),

  template: () => html`
    <!--  -->
    <div class="container py-4 px-3 mx-auto">
      <h1>Evony TKR Tips</h1>
      <hr/>
    </div>
    <div class="container py-4 px-3 mx-auto">
    <h2 id="why-another-evony-tips-site">Why Another Evony Tips Site</h2>
      <h3 id="tips-for-budget-gamers">Tips for Budget Gamers</h3>
      <div id="first">
        <p>
          There are lots of sites out there with tips on playing Evony.  Why am I
creating yet another?  I find that the advice I am giving younger and/or less
knowledgable players differs from what I find on any single site out there.
This is largely because so many of the sites are targeted on people who spend
far more on the game than I do.  While they have tons of very valuable info,
figuring out the right course for the player with a smaller budget can be a
real challenge.  This site is based on my experiences playing on a more limited
budget.
        </p>
      </div>
      <p>
        Much of the information here comes from other authors’ work on other sites.  In particular, I am heavily relying on the work of:</p>
        <ul>
          <li>
            <a href="https://www.evonyanswers.com/">Evony Answers</a>
          </li>
          <li>
            <a href="https://evonyguidewiki.com/">Evony: The King’s Return GUIDE WIKI</a>
          </li>
          <li>
            <a href="https://onechilledgamer.com/">One Chilled Gamer</a>
          </li>
          <li>
            <a href="https://www.evonytkrguide.com/">Evony The King’s Return Guides</a>
          </li>
        </ul>
      </p>
      <p>
        Many thanks to the incredible work put forth by those who have come before me on these sites in documenting Evony TKR.
      </p>
      ${sectionGrid}
    </div>
    <!--  -->
  `,
});
