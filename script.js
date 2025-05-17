let galleryImage = null;

function generatePreview() {
  const title = document.getElementById("title").value;
  const story = document.getElementById("story").value;
  const bg = document.getElementById("background").value;
  const preview = document.getElementById("preview");

  document.getElementById("previewTitle").innerText = title;
  document.getElementById("previewStory").innerText = story;

  if (bg === "sky") {
    preview.style.backgroundImage = "url('https://i.ibb.co/N7yWQzS/sky.jpg')";
  } else if (bg === "forest") {
    preview.style.backgroundImage = "url('https://i.ibb.co/vH7hKym/forest.jpg')";
  } else if (bg === "beach") {
    preview.style.backgroundImage = "url('https://i.ibb.co/7Wqj4kh/beach.jpg')";
  } else if (bg === "night") {
    preview.style.backgroundImage = "url('https://i.ibb.co/1zxyv1X/night.jpg')";
  } else if (bg === "autumn") {
    preview.style.backgroundImage = "url('https://i.ibb.co/dDfQkmL/autumn.jpg')";
  } else {
    preview.style.backgroundImage = "none";
  }

  const storyImage = document.getElementById("storyImage");

  const imageInput = document.getElementById("imageInput");
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      storyImage.src = e.target.result;
      storyImage.style.display = "block";
    }
    reader.readAsDataURL(imageInput.files[0]);
    galleryImage = null;
  } else if (galleryImage) {
    storyImage.src = galleryImage;
    storyImage.style.display = "block";
  } else {
    storyImage.style.display = "none";
  }
}

function useGalleryImage(src) {
  galleryImage = src;
  document.getElementById("imageInput").value = "";
  generatePreview();
}

function downloadPDF() {
  const element = document.getElementById("preview");
  html2pdf().from(element).save("cerita_digital.pdf");
}

// Update fungsi saveStory untuk simpan ke galeri
function saveStory() {
  const storyData = {
    id: Date.now(),
    title: document.getElementById("title").value,
    story: document.getElementById("story").value,
    background: document.getElementById("background").value,
    imageSrc: galleryImage || null
  };

  const imageInput = document.getElementById("imageInput");
  if (imageInput.files && imageInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      storyData.imageSrc = e.target.result;
      saveToGallery(storyData);
    }
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveToGallery(storyData);
  }
}

function saveToGallery(storyData) {
  let gallery = JSON.parse(localStorage.getItem("storyGallery")) || [];
  gallery.push(storyData);
  localStorage.setItem("storyGallery", JSON.stringify(gallery));
  alert("Cerita berhasil disimpan ke galeri!");
  loadGallery();
}

function loadGallery() {
  const gallery = JSON.parse(localStorage.getItem("storyGallery")) || [];
  const galleryList = document.getElementById("galleryList");
  galleryList.innerHTML = "";

  if (gallery.length === 0) {
    galleryList.innerHTML = "<p>Belum ada cerita tersimpan.</p>";
    return;
  }

  gallery.forEach(item => {
    const div = document.createElement("div");
    div.className = "gallery-item";
    div.innerHTML = `
      <span onclick="loadStoryFromGallery(${item.id})">${item.title || "(Judul kosong)"}</span>
      <button onclick="deleteStoryFromGallery(event, ${item.id})">Hapus</button>
    `;
    galleryList.appendChild(div);
  });
}

function loadStoryFromGallery(id) {
  const gallery = JSON.parse(localStorage.getItem("storyGallery")) || [];
  const storyData = gallery.find(item => item.id === id);
  if (!storyData) {
    alert("Cerita tidak ditemukan!");
    return;
  }

  document.getElementById("title").value = storyData.title || "";
  document.getElementById("story").value = storyData.story || "";
  document.getElementById("background").value = storyData.background || "";
  galleryImage = storyData.imageSrc || null;
  document.getElementById("imageInput").value = "";

  generatePreview();
  alert("Cerita berhasil dimuat dari galeri!");
}

function deleteStoryFromGallery(event, id) {
  event.stopPropagation();
  let gallery = JSON.parse(localStorage.getItem("storyGallery")) || [];
  gallery = gallery.filter(item => item.id !== id);
  localStorage.setItem("storyGallery", JSON.stringify(gallery));
  loadGallery();
}

// Fungsi muat cerita terakhir (bukan galeri)
function loadStory() {
  const saved = localStorage.getItem("savedStory");
  if (!saved) {
    alert("Tidak ada cerita yang disimpan.");
    return;
  }

  const storyData = JSON.parse(saved);
  document.getElementById("title").value = storyData.title || "";
  document.getElementById("story").value = storyData.story || "";
  document.getElementById("background").value = storyData.background || "";
  galleryImage = storyData.imageSrc || null;
  document.getElementById("imageInput").value = "";

  generatePreview();
  alert("Cerita berhasil dimuat!");
}

// Audio Narasi Otomatis
let synth = window.speechSynthesis;
let utterance = null;

function playNarration() {
  if (synth.speaking) {
    alert("Narasi sedang berjalan!");
    return;
  }

  const title = document.getElementById("title").value;
  const story = document.getElementById("story").value;
  if (!title && !story) {
    alert("Tolong isi judul dan cerita terlebih dahulu.");
    return;
  }

  const textToSpeak = (title ? "Judul cerita: " + title + ". " : "") + (story ? "Isi cerita: " + story : "");

  utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = 'id-ID';
  synth.speak(utterance);
}

function stopNarration() {
  if (synth.speaking) {
    synth.cancel();
  }
}

window.onload = function() {
  generatePreview();
  loadGallery();
};


