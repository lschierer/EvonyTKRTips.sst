import { html } from '@gracile/gracile/server-html';
import { nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import 'iconify-icon';

export interface ImageProps {
  path: string;
  alt?: string;
}

export interface iconifyProps {
  name: string;
  style?: string;
  width?: string;
  height?: string;
}

export interface cardProps {
  title: string;
  description?: string;
  image?: ImageProps;
  iconifyIcon?: iconifyProps;
  link?: string;
}

export const card = (props: cardProps) => {
  let image = html``;
  if (props.image !== undefined && props.image !== null) {
    image = html`
      <img
        src=${props.image.path}
        class="card-img-top"
        alt="${ifDefined(props.image.alt)}"
      />
    `;
  } else if (
    props.iconifyIcon !== undefined &&
    props.iconifyIcon.name.length > 0
  ) {
    let style = '';
    if (
      props.iconifyIcon.style !== undefined &&
      props.iconifyIcon.style.length > 0
    ) {
      style = props.iconifyIcon.style;
    }
    image = html`
      <iconify-icon
        icon="${props.iconifyIcon.name}"
        style?=${style || nothing}
        width=${props.iconifyIcon.width || nothing}
        height=${props.iconifyIcon.height || nothing}
      ></iconify-icon>
    `;
  }
  let body = html`<h5 class="card-title">${props.title}</h5>`;
  if (props.description !== undefined && props.description?.length > 0) {
    body = html` <p class="card-text">${props.description}</p> `;
  }
  body = html`
    ${image}
    <div class="card-body">
      <h5 class="card-title">${props.title}</h5>
      ${body}
    </div>
  `;
  if (props.link !== undefined && props.link.length > 0) {
    body = html` <a href="${props.link}" class="btn btn-primary">${body}</a> `;
  }
  return html` <div class="card" style="width: 18rem;">${body}</div> `;
};
