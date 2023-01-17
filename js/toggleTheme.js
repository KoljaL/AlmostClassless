// add CSS to header
var style = document.createElement('style');
style.innerHTML = /*CSS*/ `
.theme-toggle.theme-toggle--reversed .theme-toggle__classic {
  transform: scale(-1, 1);
}

.theme-toggle__classic path {
  transition-timing-function: cubic-bezier(0, 0, 0.15, 1.25);
  transform-origin: center;
  transition-duration: calc(var(--theme-toggle__classic--duration) * 0.8);
}

.theme-toggle__classic g path {
  transition-property: opacity, transform;
  transition-delay: calc(var(--theme-toggle__classic--duration) * 0.2);
}

.theme-toggle__classic :first-child path {
  transition-property: transform, d;
}

.theme-toggle input[type="checkbox"]:checked~.theme-toggle__classic g path,
.theme-toggle--toggled:not(label).theme-toggle .theme-toggle__classic g path {
  transform: scale(0.5) rotate(45deg);
  opacity: 0;
  transition-delay: 0s;
}

.theme-toggle input[type="checkbox"]:checked~.theme-toggle__classic :first-child path,
.theme-toggle--toggled:not(label).theme-toggle .theme-toggle__classic :first-child path {
  d: path("M-12 5h30a1 1 0 0 0 9 13v24h-39Z");
  transition-delay: calc(var(--theme-toggle__classic--duration) * 0.2);
}

@supports not (d: path("")) {

  .theme-toggle input[type="checkbox"]:checked~.theme-toggle__classic :first-child path,
  .theme-toggle--toggled:not(label).theme-toggle .theme-toggle__classic :first-child path {
    transform: translate3d(-12px, 10px, 0);
  }
}

.theme-toggle {
  border: none;
  background: 0 0;
  cursor: pointer;
  margin-right: .5rem;
}

.theme-toggle input[type="checkbox"] {
  display: none;
}

.theme-toggle .theme-toggle-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
`;

const HTML = /*HTML*/ `
<input type="checkbox" />
<span class="theme-toggle-sr">Toggle theme</span>
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="2em" height="2em" fill="var(--secondary-light)" stroke-linecap="round" class="theme-toggle__classic" viewBox="0 0 32 32">
  <clipPath id="theme-toggle__classic__cutout">
    <path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
  </clipPath>
  <g clip-path="url(#theme-toggle__classic__cutout)">
    <circle cx="16" cy="16" r="9.34" />
    <g stroke="var(--secondary-light)" stroke-width="1.5">
      <path d="M16 5.5v-4" />
      <path d="M16 30.5v-4" />
      <path d="M1.5 16h4" />
      <path d="M26.5 16h4" />
      <path d="m23.4 8.6 2.8-2.8" />
      <path d="m5.7 26.3 2.9-2.9" />
      <path d="m5.8 5.8 2.8 2.8" />
      <path d="m23.4 23.4 2.9 2.9" />
    </g>
  </g>
</svg>`;

// document.onload = () => {
//     const faviconEl = document.querySelector('link[rel="icon"]');
//     document.getElementsByTagName('HEAD')[0].appendChild(style);
//     document.querySelector('.theme-toggle').innerHTML = HTML;
//     document.querySelector('.theme-toggle').addEventListener('change', () => {
//         toggleTheme();
//     });
// };
// var toggle = document.querySelector('.theme-toggle');
// var storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
// if (storedTheme)
//   document.documentElement.setAttribute('data-theme', storedTheme)

// toggleTheme();

function toggleTheme() {
    var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    var targetTheme = 'light';
    faviconEl.setAttribute('href', 'img/favicon-light.png');
    if (currentTheme === 'light') {
        targetTheme = 'dark';
        faviconEl.setAttribute('href', 'img/favicon-dark.png');
    }
    document.documentElement.setAttribute('data-theme', targetTheme);
    // localStorage.setItem('theme', targetTheme);
}

const faviconEl = document.querySelector('link[rel="icon"]');
document.getElementsByTagName('HEAD')[0].appendChild(style);
document.querySelector('.theme-toggle').innerHTML = HTML;
document.querySelector('.theme-toggle').addEventListener('change', () => {
    toggleTheme();
});
