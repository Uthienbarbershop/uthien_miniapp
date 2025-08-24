window.onload = () => {
  const body = document.body;
  for (let i = 0; i < 10; i++) {
    const lantern = document.createElement('img');
    lantern.src = 'images/lantern.png'; // bạn cần đặt đúng tên file
    lantern.className = 'lantern';
    lantern.style.left = `${Math.random() * 100}%`;
    lantern.style.animationDelay = `${Math.random() * 5}s`;
    body.appendChild(lantern);
  }
};