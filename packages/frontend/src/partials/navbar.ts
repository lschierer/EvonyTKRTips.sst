import { html } from '@gracile/gracile/server-html';

export const navbar = (current: string) => {
  const sections = ['Generals', 'Monsters', 'SvS', 'Reference'];

  return html`
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Evony TKR Tips</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            ${sections.map((section) => {
              let item = html``;
              if (!current.localeCompare(section.toLocaleLowerCase())) {
                item = html`
                  <a class="nav-link active" aria-current="page" href="#"
                    >${section}</a
                  >
                `;
              } else {
                item = html`
                  <a class="nav-link" href="/${section.toLocaleLowerCase()}/"
                    >${section}</a
                  >
                `;
              }
              item = html` <li class="nav-item">${item}</li> `;
              return item;
            })}
          </ul>
        </div>
      </div>
    </nav>
  `;
};
