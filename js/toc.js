function markerTOC() {
    var toc = document.querySelector('.toc');
    var tocPath = document.querySelector('.toc-marker path');
    var tocItems, lastPathStart, lastPathEnd;
    // Factor of screen size that the element must cross before it's considered visible
    var TOP_MARGIN = 0.1,
        BOTTOM_MARGIN = 0.2;
    var pathLength;
    window.addEventListener('resize', drawPath, false);
    window.addEventListener('scroll', sync, false);
    drawPath();
    function drawPath() {
        tocItems = [].slice.call(toc.querySelectorAll('li'));
        // Cache element references and measurements
        tocItems = tocItems.map(function (item) {
            var anchor = item.querySelector('a');
            var target = document.getElementById(anchor.getAttribute('href').slice(1));
            // console.log(target);
            return {
                listItem: item,
                anchor: anchor,
                target: target,
            };
        });

        // Remove missing targets
        tocItems = tocItems.filter(function (item) {
            return !!item.target;
        });

        var path = [];
        var pathIndent;
        tocItems.forEach(function (item, i) {
            var x = item.anchor.offsetLeft - 5,
                y = item.anchor.offsetTop,
                height = item.anchor.offsetHeight;
            if (i === 0) {
                path.push('M', x, y, 'L', x, y + height);
                item.pathStart = 0;
            } else {
                // Draw an additional line when there's a change in indent levels
                if (pathIndent !== x) path.push('L', pathIndent, y);
                path.push('L', x, y);
                // Set the current path so that we can measure it
                tocPath.setAttribute('d', path.join(' '));
                item.pathStart = tocPath.getTotalLength() || 0;
                path.push('L', x, y + height);
            }
            pathIndent = x;
            tocPath.setAttribute('d', path.join(' '));
            item.pathEnd = tocPath.getTotalLength();
        });
        pathLength = tocPath.getTotalLength();
        sync();
    }

    function sync() {
        var windowHeight = window.innerHeight;
        var pathStart = pathLength,
            pathEnd = 0;
        var visibleItems = 0;
        tocItems.forEach(function (item) {
            var targetBounds = item.target.getBoundingClientRect();
            if (targetBounds.bottom > windowHeight * TOP_MARGIN && targetBounds.top < windowHeight * (1 - BOTTOM_MARGIN)) {
                pathStart = Math.min(item.pathStart, pathStart);
                pathEnd = Math.max(item.pathEnd, pathEnd);
                visibleItems += 1;
                item.listItem.classList.add('visible');
                // } else {
            } else if (visibleItems <= 1) {
                item.listItem.classList.remove('visible');
            }
        });
        // console.log(visibleItems);
        // Specify the visible path or hide the path altogether if there are no visible items
        if (visibleItems > 0 && pathStart < pathEnd) {
            if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
                tocPath.setAttribute('stroke-dashoffset', '1');
                tocPath.setAttribute('stroke-dasharray', '1, ' + pathStart + ', ' + (pathEnd - pathStart) + ', ' + pathLength);
                tocPath.setAttribute('opacity', 1);
            }
        } else {
            // } else if (visibleItems <= 1) {
            tocPath.setAttribute('opacity', 0);
        }
        lastPathStart = pathStart;
        lastPathEnd = pathEnd;
    }
}

async function generateTOC() {
    var contentContainer = document.querySelector('main');
    var headings = contentContainer.querySelectorAll('h1.forTOC, h2.forTOC, h3.forTOC, h4.forTOC, h5.forTOC, h6.forTOC');
    var tocContainer = document.querySelector('.toc');
    var ul = document.createElement('ul');
    // Loop through the headings NodeList
    for (i = 0; i <= headings.length - 1; i++) {
        var id = headings[i].innerHTML.toLowerCase().replace(/ /g, '-');
        var level = headings[i].localName.replace('h', '');
        var title = headings[i].innerHTML;
        headings[i].setAttribute('id', id);
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.setAttribute('href', '#' + id);
        a.innerHTML = title;
        // Create the hierarchy
        if (level == 1) {
            li.appendChild(a);
            ul.appendChild(li);
        } else if (level == 2) {
            child = document.createElement('ul');
            li.appendChild(a);
            child.appendChild(li);
            ul.appendChild(child);
        } else if (level == 3) {
            grandchild = document.createElement('ul');
            li.appendChild(a);
            grandchild.appendChild(li);
            child.appendChild(grandchild);
        } else if (level == 4) {
            great_grandchild = document.createElement('ul');
            li.append(a);
            great_grandchild.appendChild(li);
            grandchild.appendChild(great_grandchild);
        }
    }
    tocContainer.appendChild(ul);
    // return true;
    markerTOC();
}

// add CSS to header
var style = document.createElement('style');
style.innerHTML = /*CSS*/ `
.toc {
//   position: fixed;
//   left: 0rem;
//   top: 5em;
  padding: .5em;
  width: calc(max-content + 1em);
  line-height: 1;
  border:1px solid var(--secondary);
  border-radius: 5px;
  background-color: var(--secondary-bg);
}

.toc ul {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-left: 0em;
}

.toc ul ul {
  padding-left: 1em;
}

.toc li a {
  display: inline-block;
  color: var(--primary);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.230, 1.000, 0.320, 1.000);
}

.toc li.visible>a {
  color: var(--secondary);
  transform: translate(5px);
}

.toc-marker {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.toc-marker path {
  transition: all 0.3s ease;
}`;

document.getElementsByTagName('HEAD')[0].appendChild(style);
generateTOC();
