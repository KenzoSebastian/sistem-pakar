const button = document.querySelector("#diagnosa button");

class Gejala {
  constructor(kode, kondisi) {
    this.kode = kode;
    this.kondisi = kondisi;
  }
}

class hasil {
  constructor(penyakit, persentase, saran, pencegahan) {
    this.penyakit = penyakit;
    this.persentase = persentase;
    this.saran = saran;
    this.pecegahan = pencegahan;
  }
}

objGejala = [];
objHasil = [];

fluRingan = [];
fluBerat = [];
sars = [];
mers = [];
hiv = [];

const result = document.querySelector(".result");

// call Db.json
const tbody = document.querySelector("#tbody");
fetch("Db.json")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((gejala, index) => {
        console.log(gejala);
        tbody.innerHTML += renderGejala(gejala, index);
    });
    const opsi = Array.from(document.querySelectorAll(".opsi-kondisi"));

    opsi.forEach((e) => {
        e.addEventListener("click", () => {
        const ul = e.nextElementSibling;
        if (ul.classList.value == "hide") {
            e.classList.add("selected");
            ul.classList.remove("hide");
        } else {
            e.classList.remove("selected");
            ul.classList.add("hide");
        }

        opsi.forEach((el) => {
            if (el.nextElementSibling.classList.value == "" && el != e) {
            el.nextElementSibling.classList.add("hide");
            el.classList.remove("selected");
            }
        });

        ul.addEventListener("click", (li) => {
            e.textContent = li.target.textContent;
            ul.classList.add("hide");
            if (e.textContent === "Pilih Jika Sesuai")
            e.classList.remove("selected");
        });
        });
    });

    document.addEventListener("click", (elemen) => {
        opsi.forEach((e) => {
        if (e.nextElementSibling.classList.value == "") {
            const ul = e.nextElementSibling;

            if (elemen.target !== ul && elemen.target !== e) {
            if (e.textContent === "Pilih Jika Sesuai")
                e.classList.remove("selected");
            ul.classList.add("hide");
            }
        }
        });
    });
    
    button.addEventListener("click", () => {
      // ambil data kode dan kondisi
      opsi.forEach((e) => {
        if (Array.from(e.classList).length == 2) {
          const kode =
            e.parentElement.previousElementSibling.previousElementSibling
              .textContent;
          const kondisi = e.textContent;
          objGejala.push(new Gejala(kode, kondisi));
        }
      });

      // tampilan animasi loading
      const load = document.querySelector(".loading");
      if (result.classList.value == "result") result.classList.add("d-none");

      if (objGejala.length > 0) {
        load.classList.remove("d-none");
        setTimeout(() => {
          load.classList.add("d-none");
          result.classList.remove("d-none");
        }, 1500);
      } else {
        alert("Masukan Kondisi Anda Terlebih Dahulu");
      }

      // syarat/aturan kondisi
      objGejala.forEach((gejala) => {
        if (gejala.kondisi == "Selalu") {
          aturan(gejala.kode, 100);
        } else if (gejala.kondisi == "Sering") {
          aturan(gejala.kode, 50);
        } else if (gejala.kondisi == "Kadang-Kadang") {
          aturan(gejala.kode, 25);
        }
      });

      // masukan data ke arr objHasil
      objHasil.push(
        new hasil(
          "Flu Ringan",
          kalkulasi(fluRingan, 5),
          "Istirahat yang cukup, Mengkonsumsi makanan sehat, mengonsumsi obat flue serta multi vitamin, Olahraga ringan, Perbanyak minum air putih",
          "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari apa yang menjadi pemicu penyakit tersebut"
        )
      );
      objHasil.push(
        new hasil(
          "Flu Berat",
          kalkulasi(fluBerat, 10),
          "Istirahat yang cukup, Mengkonsumsi makanan sehat, Banyak minum air putih, Minum Obat OTC, Kurangi aktifitas yang berat",
          "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari apa yang menjadi pemicu penyakit tersebut"
        )
      );
      objHasil.push(
        new hasil(
          "Mers",
          kalkulasi(mers, 8),
          "Istirahat yang cukup, Jangan melakukan kontak langsung dengan siapapun, Mengkonsumsi makanan yang bergizi, Kurangi aktifitas yang berat",
          "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari kontak fisik dengan yang sedang mengalami sakit tersebut"
        )
      );
      objHasil.push(
        new hasil(
          "Sars",
          kalkulasi(sars, 9),
          "Istirahat yang cukup, Mengkonsumsi makanan sehat serta bergizi, Perbanyak minum air putih, Mengkonsumsi obat yang diberikan oleh dokter",
          "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari kontak fisik dengan yang sedang mengalami sakit tersebut"
        )
      );
      objHasil.push(
        new hasil(
          "HIV/AIDS",
          kalkulasi(hiv, 7),
          "Minum obat secara teratur, Pola hidup sehat, Rutin olahraga, Jauhi rokok dan minuman beralkohol, menjaga kebersihan diri, mengurangi stres",
          "Menghindari seks bebas, Menghindari penggunaan segala jenis narkotika terutama yang menggunakan jarum suntik "
        )
      );

      // arr objHasil di urutkan dari yang terbesar
      const Final = objHasil.sort((a, b) => b.persentase - a.persentase);
      console.log(Final);

      // filter array yang persentase nya 0
      const hasilFinal = Final.filter((value) => value.persentase !== 0);
      console.log(hasilFinal);

      // menampilkan pada website
      const h2Hasil = result.childNodes[5];
      const pHasil = result.childNodes[7];
      const saran = result.childNodes[13];
      const pencegahan = result.childNodes[19];

      h2Hasil.textContent = `${hasilFinal[0].persentase}% KEMUNGKINAN`;
      pHasil.textContent = `Anda Menyidap penyakit ${hasilFinal[0].penyakit}`;
      saran.textContent = hasilFinal[0].saran;
      pencegahan.textContent = hasilFinal[0].pecegahan;

      const prev = document.querySelectorAll(".result .other");
      if (prev.length > 0) {
        prev.forEach((e) => {
          e.remove();
        });
      }

      const h5 = document.querySelector(".result h5");
      if ((h5.classList.value = "d-none")) h5.classList.remove("d-none");

      for (let i = 1; i < hasilFinal.length; i++) {
        const other = document.createElement("div");
        other.classList.add("other");
        other.innerHTML = `<div class="bar">
                                <div class="fill" style="width: ${hasilFinal[i].persentase}%;"></div>
                                <h4>${hasilFinal[i].persentase}%</h4>
                            </div>
                            <p>${hasilFinal[i].penyakit}</p>`;
        result.appendChild(other);
      }

      if (hasilFinal.length > 1) h5.classList.add("d-none");

      // bersikan item selected
      opsi.forEach((e) => {
        if (e.classList[1] == "selected") {
          e.classList.remove("selected");
          e.textContent = "Pilih Jika Sesuai";
        }
      });

      // bersihkan array
      arrClear();
    });
  });

const renderGejala = (gejala, index) => ` <tr>
                                            <td>${index + 1}</td>
                                            <td>${gejala.kode}</td>
                                            <td>${gejala.nama_gejala}</td>
                                            <td>
                                                <span class="opsi-kondisi">Pilih Jika Sesuai</span>
                                                <ul class="hide">
                                                    <li>Pilih Jika Sesuai</li>
                                                    <li>Selalu</li>
                                                    <li>Sering</li>
                                                    <li>Kadang-Kadang</li>
                                                </ul>
                                            </td>
                                        </tr>
                                    `;

const menu = document.querySelector(".heading img");

menu.addEventListener("click", () => {
  const nav = document.querySelector(".nav");
  const container = document.querySelector(".container");
  if (menu.classList.value == "") {
    menu.src = "img/close.png";
    menu.classList.value = "click";
    nav.classList.add("open");
    container.classList.add("geser");
  } else {
    menu.src = "img/hamburger.png";
    menu.classList.value = "";
    nav.classList.remove("open");
    container.classList.remove("geser");
  }
});

// const opsi = Array.from(document.querySelectorAll(".opsi-kondisi"));

// opsi.forEach((e) => {
//   e.addEventListener("click", () => {
//     const ul = e.nextElementSibling;
//     if (ul.classList.value == "hide") {
//       e.classList.add("selected");
//       ul.classList.remove("hide");
//     } else {
//       e.classList.remove("selected");
//       ul.classList.add("hide");
//     }

//     opsi.forEach((el) => {
//       if (el.nextElementSibling.classList.value == "" && el != e) {
//         el.nextElementSibling.classList.add("hide");
//         el.classList.remove("selected");
//       }
//     });

//     ul.addEventListener("click", (li) => {
//       e.textContent = li.target.textContent;
//       ul.classList.add("hide");
//       if (e.textContent === "Pilih Jika Sesuai") e.classList.remove("selected");
//     });
//   });
// });

// document.addEventListener("click", (elemen) => {
//   opsi.forEach((e) => {
//     if (e.nextElementSibling.classList.value == "") {
//       const ul = e.nextElementSibling;

//       if (elemen.target !== ul && elemen.target !== e) {
//         if (e.textContent === "Pilih Jika Sesuai")
//           e.classList.remove("selected");
//         ul.classList.add("hide");
//       }
//     }
//   });
// });


//utgrferessqaqawqwfgw4reh5t5tr
// button.addEventListener("click", () => {
//     // ambil data kode dan kondisi
//     opsi.forEach((e) => {
//         if (Array.from(e.classList).length == 2) {
//         const kode =
//             e.parentElement.previousElementSibling.previousElementSibling
//             .textContent;
//         const kondisi = e.textContent;
//         objGejala.push(new Gejala(kode, kondisi));
//         }
// });

//   // tampilan animasi loading
//   const load = document.querySelector(".loading");
//   if (result.classList.value == "result") result.classList.add("d-none");

//   if (objGejala.length > 0) {
//     load.classList.remove("d-none");
//     setTimeout(() => {
//       load.classList.add("d-none");
//       result.classList.remove("d-none");
//     }, 1500);
//   } else {
//     alert("Masukan Kondisi Anda Terlebih Dahulu");
//   }

//   // syarat/aturan kondisi
//   objGejala.forEach((gejala) => {
//     if (gejala.kondisi == "Selalu") {
//       aturan(gejala.kode, 100);
//     } else if (gejala.kondisi == "Sering") {
//       aturan(gejala.kode, 50);
//     } else if (gejala.kondisi == "Kadang-Kadang") {
//       aturan(gejala.kode, 25);
//     }
//   });

//   // masukan data ke arr objHasil
//   objHasil.push(
//     new hasil(
//       "Flu Ringan",
//       kalkulasi(fluRingan, 5),
//       "Istirahat yang cukup, Mengkonsumsi makanan sehat, mengonsumsi obat flue serta multi vitamin, Olahraga ringan, Perbanyak minum air putih",
//       "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari apa yang menjadi pemicu penyakit tersebut"
//     )
//   );
//   objHasil.push(
//     new hasil(
//       "Flu Berat",
//       kalkulasi(fluBerat, 10),
//       "Istirahat yang cukup, Mengkonsumsi makanan sehat, Banyak minum air putih, Minum Obat OTC, Kurangi aktifitas yang berat",
//       "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari apa yang menjadi pemicu penyakit tersebut"
//     )
//   );
//   objHasil.push(
//     new hasil(
//       "Mers",
//       kalkulasi(mers, 8),
//       "Istirahat yang cukup, Jangan melakukan kontak langsung dengan siapapun, Mengkonsumsi makanan yang bergizi, Kurangi aktifitas yang berat",
//       "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari kontak fisik dengan yang sedang mengalami sakit tersebut"
//     )
//   );
//   objHasil.push(
//     new hasil(
//       "Sars",
//       kalkulasi(sars, 9),
//       "Istirahat yang cukup, Mengkonsumsi makanan sehat serta bergizi, Perbanyak minum air putih, Mengkonsumsi obat yang diberikan oleh dokter",
//       "Mengonsumsi Vitamin, Berolahraga, Mengonsumsi makanan dan minuman yang bergizi, Menghindari kontak fisik dengan yang sedang mengalami sakit tersebut"
//     )
//   );
//   objHasil.push(
//     new hasil(
//       "HIV/AIDS",
//       kalkulasi(hiv, 7),
//       "Minum obat secara teratur, Pola hidup sehat, Rutin olahraga, Jauhi rokok dan minuman beralkohol, menjaga kebersihan diri, mengurangi stres",
//       "Menghindari seks bebas, Menghindari penggunaan segala jenis narkotika terutama yang menggunakan jarum suntik "
//     )
//   );

//   // arr objHasil di urutkan dari yang terbesar
//   const Final = objHasil.sort((a, b) => b.persentase - a.persentase);
//   console.log(Final);

//   // filter array yang persentase nya 0
//   const hasilFinal = Final.filter((value) => value.persentase !== 0);
//   console.log(hasilFinal);

//   // menampilkan pada website
//   const h2Hasil = result.childNodes[5];
//   const pHasil = result.childNodes[7];
//   const saran = result.childNodes[13];
//   const pencegahan = result.childNodes[19];

//   h2Hasil.textContent = `${hasilFinal[0].persentase}% KEMUNGKINAN`;
//   pHasil.textContent = `Anda Menyidap penyakit ${hasilFinal[0].penyakit}`;
//   saran.textContent = hasilFinal[0].saran;
//   pencegahan.textContent = hasilFinal[0].pecegahan;

//   const prev = document.querySelectorAll(".result .other");
//   if (prev.length > 0) {
//     prev.forEach((e) => {
//       e.remove();
//     });
//   }

//   const h5 = document.querySelector(".result h5");
//   if ((h5.classList.value = "d-none")) h5.classList.remove("d-none");

//   for (let i = 1; i < hasilFinal.length; i++) {
//     const other = document.createElement("div");
//     other.classList.add("other");
//     other.innerHTML = `<div class="bar">
//                                 <div class="fill" style="width: ${hasilFinal[i].persentase}%;"></div>
//                                 <h4>${hasilFinal[i].persentase}%</h4>
//                             </div>
//                             <p>${hasilFinal[i].penyakit}</p>`;
//     result.appendChild(other);
//   }

//   if (hasilFinal.length > 1) h5.classList.add("d-none");

//   // bersikan item selected
//   opsi.forEach((e) => {
//     if (e.classList[1] == "selected") {
//       e.classList.remove("selected");
//       e.textContent = "Pilih Jika Sesuai";
//     }
//   });

//   // bersihkan array
//   arrClear();
// });

function aturan(kode, value) {
  atfluRingan(kode, value);
  atfluBerat(kode, value);
  atmers(kode, value);
  atsars(kode, value);
  athiv(kode, value);
}

function atfluRingan(kode, value) {
  if (
    kode == "G01" ||
    kode == "G03" ||
    kode == "G09" ||
    kode == "G014" ||
    kode == "G019"
  ) {
    fluRingan.push(value);
  }
}
function atfluBerat(kode, value) {
  if (
    kode == "G01" ||
    kode == "G03" ||
    kode == "G04" ||
    kode == "G06" ||
    kode == "G09" ||
    kode == "G013" ||
    kode == "G014" ||
    kode == "G017" ||
    kode == "G019" ||
    kode == "G020"
  ) {
    fluBerat.push(value);
  }
}
function atmers(kode, value) {
  if (
    kode == "G01" ||
    kode == "G02" ||
    kode == "G05" ||
    kode == "G07" ||
    kode == "G010" ||
    kode == "G011" ||
    kode == "G018" ||
    kode == "G022"
  ) {
    mers.push(value);
  }
}
function atsars(kode, value) {
  if (
    kode == "G01" ||
    kode == "G02" ||
    kode == "G05" ||
    kode == "G08" ||
    kode == "G09" ||
    kode == "G011" ||
    kode == "G013" ||
    kode == "G021" ||
    kode == "G022"
  ) {
    sars.push(value);
  }
}

function athiv(kode, value) {
  if (
    kode == "G023" ||
    kode == "G024" ||
    kode == "G025" ||
    kode == "G026" ||
    kode == "G027" ||
    kode == "G028" ||
    kode == "G029"
  ) {
    hiv.push(value);
  }
}

function arrClear() {
  objGejala.length = 0;
  objHasil.length = 0;
  fluRingan.length = 0;
  fluBerat.length = 0;
  sars.length = 0;
  mers.length = 0;
  hiv.length = 0;
  return false;
}

function kalkulasi(arr, maxLength = 0) {
  if (arr.length == 0) arr.push(0);
  const result = Math.floor(arr.reduce((acc, val) => acc + val) / maxLength);
  return result;
}
