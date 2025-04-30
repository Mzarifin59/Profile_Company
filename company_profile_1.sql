-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 25 Apr 2025 pada 08.56
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `company_profile_1`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `artikel`
--

CREATE TABLE `artikel` (
  `id` int(11) NOT NULL,
  `title` varchar(250) NOT NULL,
  `slug` varchar(200) NOT NULL,
  `description` varchar(250) NOT NULL,
  `date` date NOT NULL,
  `image` varchar(250) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `artikel`
--

INSERT INTO `artikel` (`id`, `title`, `slug`, `description`, `date`, `image`, `content`) VALUES
(1, 'Transformasi Digital Lebih Cepat dengan SOLUSNect', 'transformasi-digital-lebih-cepat-dengan-solusnect', 'Dalam era digital saat ini, konektivitas antar sistem menjadi kunci sukses sebuah perusahaan. PT Solusi Koneksi Anda menghadirkan SOLUSNect.', '2025-04-12', '/img/1745563010661.jpg', 'Dalam era digital saat ini, konektivitas antar sistem menjadi kunci sukses sebuah perusahaan. PT Solusi Koneksi Anda menghadirkan **SOLUSNect**, solusi integrasi API modern yang membantu bisnis menghubungkan aplikasi-aplikasi penting dengan mudah dan aman.\r\n\r\nDengan **SOLUSNect**, perusahaan dapat:\r\n- Mengintegrasikan sistem lama (legacy) dengan aplikasi baru\r\n- Mengelola koneksi antar API melalui dashboard yang intuitif\r\n- Meningkatkan efisiensi operasional melalui automasi data lintas sistem\r\n\r\nTak hanya mempercepat transformasi digital, SOLUSNect juga mendukung skalabilitas dan keamanan berstandar tinggi. Solusi ideal bagi perusahaan yang ingin lincah dan adaptif di era integrasi digital.'),
(2, 'Bangun Website Profesional dengan Mudah Menggunakan SOLUSWeb', 'bangun-website-profesional-dengan-mudah menggunakan-solusweb', 'Memiliki website profesional kini menjadi kebutuhan mendasar bagi semua jenis bisnis. Melalui SOLUSWeb, PT Solusi Koneksi Anda menawarkan platform pembuatan website yang tidak hanya cepat dan responsi', '2025-04-19', '/img/1745563179064.jpg', 'Memiliki website profesional kini menjadi kebutuhan mendasar bagi semua jenis bisnis. Melalui **SOLUSWeb**, PT Solusi Koneksi Anda menawarkan platform pembuatan website yang tidak hanya cepat dan responsif, tetapi juga mudah dikelola.\r\n\r\nApa yang membuat SOLUSWeb berbeda?\r\n- CMS intuitif untuk update konten secara mandiri\r\n- Desain responsif dan cepat di semua perangkat\r\n- Dapat dikustomisasi untuk berbagai kebutuhan: profil perusahaan, e-commerce, portal berita, dan lainnya\r\n\r\nDengan **SOLUSWeb**, bisnis tidak hanya tampil online — tetapi tampil **menarik**, **profesional**, dan **berdaya saing**.'),
(3, 'Kelola Data Lebih Andal dan Aman dengan SOLUSBase', 'kelola-data-lebih-andal-dan-aman-dengan-slusbase', 'Data adalah aset paling berharga dalam bisnis modern. Oleh karena itu, pengelolaan data yang baik menjadi sangat penting. PT Solusi Koneksi Anda mempersembahkan SOLUSBase.', '2025-04-19', '/img/1745563190471.jpg', 'Data adalah aset paling berharga dalam bisnis modern. Oleh karena itu, pengelolaan data yang baik menjadi sangat penting. PT Solusi Koneksi Anda mempersembahkan **SOLUSBase**, solusi database handal yang dirancang untuk kebutuhan bisnis yang terus berkembang.\r\n\r\nKeunggulan SOLUSBase:\r\n- Arsitektur scalable, cocok untuk aplikasi berskala kecil hingga enterprise\r\n- Performa tinggi untuk akses dan pemrosesan data secara real-time\r\n- Sistem keamanan yang menjaga integritas dan kerahasiaan data\r\n\r\nDengan **SOLUSBase**, tim pengembang dan IT memiliki fondasi kuat untuk membangun aplikasi yang andal dan siap menghadapi tantangan data besar di masa depan.'),
(8, 'Cara Menyalakan Laptop', 'cara-meyalakan-laptop', 'gini nih cara nyalain laptop', '2025-04-24', '/img/1745563957400.jpg', 'Caranya adalah pencet tombol power');

-- --------------------------------------------------------

--
-- Struktur dari tabel `artikel_tags`
--

CREATE TABLE `artikel_tags` (
  `artikel_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `artikel_tags`
--

INSERT INTO `artikel_tags` (`artikel_id`, `tag_id`) VALUES
(1, 2),
(1, 4),
(2, 3),
(3, 2),
(3, 3),
(8, 2),
(8, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `galery`
--

CREATE TABLE `galery` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `image` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `galery`
--

INSERT INTO `galery` (`id`, `title`, `image`) VALUES
(1, 'Telepon Genggam', '/img/1745555944194.jpg'),
(2, 'Musium Indonesia', '/img/1745555953877.jpg'),
(3, 'Perkembangan Dasar 5G Negara', '/img/1745555963338.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE `produk` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id`, `title`, `description`, `image`) VALUES
(1, 'SOLUSNect', '**SOLUSNect** adalah platform integrasi API cerdas yang dirancang untuk menghubungkan berbagai sistem dan aplikasi secara seamless. Dengan dukungan standar keamanan industri dan kemampuan orkestrasi yang fleksibel, SOLUSNect memungkinkan bisnis untuk menyatukan alur data dari berbagai sumber, baik internal maupun eksternal. Cocok untuk organisasi yang sedang melakukan transformasi digital dan ingin memastikan integrasi sistem berjalan mulus dan efisien.', '/img/1745555873927.jpg'),
(2, 'SOLUSWeb', '**SOLUSWeb** merupakan solusi lengkap untuk pembuatan dan pengelolaan situs web modern. Dilengkapi dengan sistem manajemen konten (CMS) yang intuitif, SOLUSWeb memudahkan tim non-teknis untuk memperbarui konten secara mandiri. Platform ini dirancang responsif untuk semua perangkat, memiliki kecepatan akses tinggi, serta dapat dikustomisasi untuk berbagai kebutuhan bisnis — dari landing page hingga portal perusahaan.\r\n', '/img/1745555893144.jpg'),
(3, 'SOLUSBase', '**SOLUSBase** adalah sistem manajemen basis data yang powerful dan scalable, dirancang untuk mendukung aplikasi berskala besar maupun menengah. Dengan arsitektur yang efisien dan dukungan pengelolaan data yang kuat, SOLUSBase membantu tim developer dan IT mengelola data dengan lebih cepat, aman, dan terstruktur. Sangat ideal untuk proyek yang membutuhkan performa tinggi dan keandalan dalam penyimpanan serta pemrosesan data.', '/img/1745555903111.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `tags`
--

INSERT INTO `tags` (`id`, `name`) VALUES
(2, 'Cloud'),
(3, 'Project'),
(4, 'Product');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `artikel_tags`
--
ALTER TABLE `artikel_tags`
  ADD PRIMARY KEY (`artikel_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indeks untuk tabel `galery`
--
ALTER TABLE `galery`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `galery`
--
ALTER TABLE `galery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `produk`
--
ALTER TABLE `produk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `artikel_tags`
--
ALTER TABLE `artikel_tags`
  ADD CONSTRAINT `artikel_tags_ibfk_1` FOREIGN KEY (`artikel_id`) REFERENCES `artikel` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artikel_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
