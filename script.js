const counterContainer = document.querySelector(".counter-container");
const numbersContainer = document.querySelector(".numbers-container");
const counter = document.querySelector(".counter");

const numberPaths = [
  "M87.9,79.2c1.1-0.4,53.7-39.2,54.9-39.1v180.5",
  "M81.7,85.7c-1.4-67,112.3-55.1,90.2,11.6c-12.6,32-70.6,83.7-88.8,113.7h105.8",
  "M74.8,178.5c3,39.4,63.9,46.7,88.6,23.7c34.3-35.1,5.4-75.8-41.7-77c29.9,5.5,68.7-43.1,36.5-73.7 c-23.4-21.5-76.5-11.1-78.6,25",
  "M161.9,220.8 161.9,41 72.6,170.9 208.2,170.9",
  "M183.2,43.7H92.1l-10,88.3c0,0,18.3-21.9,51-21.9s49.4,32.6,49.4,48.2c0,22.2-9.5,57-52.5,57s-51.4-36.7-51.4-36.7",
  "M177.4,71.6c0,0-4.3-30.3-44.9-30.3s-57.9,45.6-57.9,88.8s9,86.5,56.2,86.5c38.9,0,50.9-22.3,50.9-60.9c0-17.6-21-44.9-48.2-44.9c-36.2,0-55.2,29.6-55.2,58.2",
  "M73.3,43.7 177.7,43.7 97.9,220.6 ",
  "M126.8,122.8c0,0,48.2-1.3,48.2-42.2s-48.2-39.9-48.2-39.9s-45.9,0-45.9,40.9 c0,20.5,18.8,41.2,46.9,41.2c29.6,0,54.9,18,54.9,47.2c0,0,2,44.9-54.2,44.9c-55.5,0-54.2-43.9-54.2-43.9s-0.3-47.9,53.6-47.9",
  "M78.9,186.3c0,0,4.3,30.3,44.9,30.3s57.9-45.6,57.9-88.8s-9-86.5-56.2-86.5 c-38.9,0-50.9,22.3-50.9,60.9c0,17.6,21,44.9,48.2,44.9c36.2,0,55.2-29.6,55.2-58.2",
];

let activeNumber = 1;
const circlesAmount = 30;
const cicleRadius = 15;
const lerp = (x, y, a) => x * (1 - a) + y * a;

const switchRandomNumbers = () => {
  const randomNumber = Math.floor(Math.random() * 9) + 1;

  handleActiveBtn(randomNumber);
};

const populateNumbers = () => {
  [...Array(9).keys()].forEach((i) => {
    const buttonEl = document.createElement("button");

    buttonEl.classList.add("number-btn");

    const elContent = i + 1;

    buttonEl.addEventListener("click", () => handleActiveBtn(elContent));

    buttonEl.innerText = elContent;

    numbersContainer.appendChild(buttonEl);
  });

  switchRandomNumbers();
};

const circleAnimation = (animationId, circle, x = 0, y = 0) => {
  const lerpIncrement = 0.05 + (0.025 * circle.index) / 5;

  const transitionX = lerp(circle.cx.baseVal.value, x, lerpIncrement);
  const transitionY = lerp(circle.cy.baseVal.value, y, lerpIncrement);

  circle.setAttribute("cx", transitionX);
  circle.setAttribute("cy", transitionY);

  const parseX = +parseFloat(x).toFixed(3);
  const parseY = +parseFloat(y).toFixed(3);

  const parseCircleX = +parseFloat(circle.cx.baseVal.value).toFixed(3);
  const parseCircleY = +parseFloat(circle.cy.baseVal.value).toFixed(3);

  if (parseX == parseCircleX && parseY == parseCircleY) {
    console.log("done");
    cancelAnimationFrame(animationId);
    return;
  }

  requestAnimationFrame(() => circleAnimation(animationId, circle, x, y));
};

const handleActiveBtn = (num) => {
  activeNumber = num;
  const children = numbersContainer.children;

  for (const child of children) {
    child.classList.remove("active-btn");
    if (child.innerHTML == num) child.classList.add("active-btn");
  }

  counter.innerHTML = `
  <svg viewBox="0 0 256 256">
  
    <defs>
      <filter id="gooFilter">
        <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur" />
        <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -8" result="filter"/>
      </filter>
    </defs>

    <path class='number-path' d="${
      numberPaths[activeNumber - 1]
    }" fill="#283618"/>

    <g class="circles-group">
        ${[...Array(circlesAmount).keys()].map((i) => {
          return `<circle r="${cicleRadius}" cx="126" cy="126" />`;
        })}
    </g>
  </svg>
`;

  const circlesGroup = document.querySelector(".circles-group");
  const circles = circlesGroup.children;
  const numberPath = document.querySelector(".number-path");

  const length = numberPath.getTotalLength();
  const step = length / circlesAmount;

  let index = -1;
  for (const circle of circles) {
    index++;
    circle.index = index || 1;

    const { x, y } = numberPath.getPointAtLength(index * step);

    const animateCircle = requestAnimationFrame(() =>
      circleAnimation(animateCircle, circle, x, y)
    );
  }
};

const counterInterval = setInterval(switchRandomNumbers, 1500);

populateNumbers();
