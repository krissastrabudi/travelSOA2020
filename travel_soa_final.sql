-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 30 Bulan Mei 2020 pada 14.31
-- Versi server: 10.1.35-MariaDB
-- Versi PHP: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `travel_soa`
--
--CREATE DATABASE IF NOT EXISTS `travel_soa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
--USE `travel_soa`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `comment`
--

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
  `id_comment` int(10) NOT NULL,
  `email_comment` varchar(255) NOT NULL,
  `nama_hotel` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `judul_comment` varchar(255) NOT NULL,
  `isi_comment` varchar(255) NOT NULL,
  `stars` int(1) NOT NULL,
  `date_posted_comment` date NOT NULL,
  `date_edited` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `comment`
--

INSERT INTO `comment` (`id_comment`, `email_comment`, `nama_hotel`, `lokasi`, `judul_comment`, `isi_comment`, `stars`, `date_posted_comment`, `date_edited`) VALUES
(2, 'sastrabudi@gmail.com', 'JW Marriot', 'New York', 'Good!', 'Nice and clean hotel, friendly crew and good food. Only follow up on mentioned environmental plan could be better. Like changing towels, when they are on hand rail, and card mention to use again.', 5, '2020-05-01', '0000-00-00'),
(4, 'sastrabudi@gmail.com', 'JW Marriot', 'New York', 'Very Bad!', 'very very bad', 1, '2020-05-01', '2020-05-01'),
(6, 'sastrabudi@gmail.com', 'JW Marriot', 'New York', 'Good!', 'Nice and clean hotel, friendly crew and good food. Only follow up on mentioned environmental plan could be better. Like changing towels, when they are on hand rail, and card mention to use again.', 5, '2020-05-01', '0000-00-00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `dbooking`
--

DROP TABLE IF EXISTS `dbooking`;
CREATE TABLE `dbooking` (
  `booking_id` bigint(20) NOT NULL,
  `jenis_kamar` varchar(255) NOT NULL,
  `harga` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `subtotal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `dbooking`
--

INSERT INTO `dbooking` (`booking_id`, `jenis_kamar`, `harga`, `quantity`, `subtotal`) VALUES
(2, '\"Standard\"', 40, 2, 80),
(2, '\"Family Room\"', 65, 1, 65),
(3, '\"Family Room\"', 65, 1, 65),
(3, '\"Standard\"', 40, 2, 80),
(4, '\"Family Room\"', 65, 1, 65),
(4, '\"Standard\"', 40, 2, 80),
(5, '\"Standard\"', 40, 2, 80),
(5, '\"Family Room\"', 65, 1, 65),
(6, '\"Standard\"', 40, 2, 80),
(6, '\"Family Room\"', 65, 1, 65),
(7, '\"Standard\"', 40, 2, 80),
(7, '\"Family Room\"', 65, 1, 65),
(8, '\"Standard\"', 40, 2, 80),
(8, '\"Family Room\"', 65, 1, 65),
(9, '\"Standard\"', 40, 2, 80),
(9, '\"Family Room\"', 65, 1, 65),
(9, '\"Standard\"', 50, 1, 50),
(9, '\"Luxury Room\"', 80, 1, 80);

-- --------------------------------------------------------

--
-- Struktur dari tabel `hbooking`
--

DROP TABLE IF EXISTS `hbooking`;
CREATE TABLE `hbooking` (
  `booking_id` bigint(20) NOT NULL,
  `nama_hotel` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `total_harga` int(11) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `check_in` datetime NOT NULL,
  `check_out` datetime NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_booking` int(11) NOT NULL COMMENT '1 untuk user book, 2 untuk book pay, 3 book hotel, 4 success, 5 failed, 6 request reschedule, 7 request cancel, 8 canceled, 9 dana berhasil di refund',
  `request_id` varchar(10) NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `hbooking`
--

INSERT INTO `hbooking` (`booking_id`, `nama_hotel`, `lokasi`, `total_harga`, `customer_email`, `check_in`, `check_out`, `datetime`, `status_booking`, `request_id`, `last_update`) VALUES
(0, 'JW Marriot', 'New York', 390, 'william@gmail.com', '2020-06-01 00:00:00', '2020-06-04 00:00:00', '2020-05-30 12:26:11', 5, '', '2020-05-30 12:30:16'),
(2, 'JW Marriot', 'New York', 0, 'sastrabudi@gmail.com', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '2020-05-10 04:34:11', 6, 'R201', '2020-05-30 07:56:28'),
(3, 'JW Marriot', 'New York', 100000, 'sastrabudi@gmail.com', '2020-05-22 00:00:00', '2020-05-30 00:00:00', '2020-05-10 04:35:11', 9, '0', '2020-05-30 09:50:23'),
(4, 'JW Marriot', 'New York', 1500000, 'sastrabudi@gmail.com', '2020-05-22 00:00:00', '2020-05-30 00:00:00', '2020-05-10 04:36:55', 4, '0', '2020-05-30 09:37:42'),
(5, 'JW Marriot', 'New York', 145000, 'sastrabudi@gmail.com', '2020-05-10 00:00:00', '2020-05-04 00:00:00', '2020-05-10 11:40:46', 14, '0', '2020-05-14 04:56:44'),
(6, 'JW Marriot', 'New York', 1450000, 'sastrabudi@gmail.com', '2020-05-12 00:00:00', '2020-05-13 00:00:00', '2020-05-10 11:43:13', 4, '0', '2020-05-30 09:54:44'),
(7, 'JW Marriot', 'New York', 145000, 'sastrabudi@gmail.com', '2020-05-10 00:00:00', '2020-06-20 00:00:00', '2020-05-13 06:56:08', 1, '0', '2020-05-14 05:15:18'),
(8, 'JW Marriot', 'New York', 145, 'sastrabudi@gmail.com', '2020-06-12 00:00:00', '2020-06-20 00:00:00', '2020-05-13 07:30:43', 1, '0', '2020-05-13 07:30:43'),
(9, 'JW Marriot', 'New York', 145, 'sastrabudi@gmail.com', '2020-06-12 00:00:00', '2020-06-20 00:00:00', '2020-05-13 07:31:17', 1, '0', '2020-05-13 07:31:17');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `payment_id` varchar(20) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `request_id` varchar(10) NOT NULL,
  `xendit_id` varchar(100) NOT NULL,
  `payment_by` varchar(100) NOT NULL,
  `amount` int(11) NOT NULL,
  `datetime_payment` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `payment`
--

INSERT INTO `payment` (`payment_id`, `booking_id`, `request_id`, `xendit_id`, `payment_by`, `amount`, `datetime_payment`) VALUES
('payment_0j9MF1GG', 0, 'R301', '5ec4e1d30d071f1fd259706c', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_1DOcl1xU', 0, 'R401', '5ec4f1690d071f1fd2597131', 'sastrabudi@gmail.com', 2312750, '2020-05-20 08:59:21'),
('payment_3butqOks', 0, 'R401', '5ec4e9710d071f1fd25970b5', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_3FVHiJKK', 0, 'R601', '5ed218930d071f1fd259c29d', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:25:55'),
('payment_4jZdd2w0', 0, 'R401', '5ec4e4b90d071f1fd2597089', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_61lrXrTK', 0, 'R401', '5ec4ef920d071f1fd259710f', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_6z279r6c', 0, 'R601', '5ed21a800d071f1fd259c2ad', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:34:09'),
('payment_bmmc0ub7', 0, 'R601', '5ed21dd50d071f1fd259c2d8', 'sastrabudi@gmail.com', 2283750, '2020-05-30 08:48:21'),
('payment_bp3Zuir4', 0, 'R401', '5ec4edc60d071f1fd25970f9', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_BqrqTPHV', 5, '', '', 'sastrabudi@gmail.com', 145, '2020-05-11 11:55:32'),
('payment_c64FgqPM', 5, '', '', 'sastrabudi@gmail.com', 145, '2020-05-11 11:56:47'),
('payment_cjTkTXyZ', 6, '', '', 'sastrabudi@gmail.com', 1450000, '2020-05-11 11:58:08'),
('payment_cP4OWASI', 3, '', '5ebcd34c7d674631dda4e9fc', 'sastrabudi@gmail.com', 100000, '2020-05-14 05:12:43'),
('payment_dzXPyjxR', 0, 'R601', '5ed218d20d071f1fd259c29f', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:26:58'),
('payment_emBPPX5D', 0, 'R401', '5ec4e4470d071f1fd2597082', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_EnOfcPI3', 5, '', '5ebccd7c7d674631dda4e9e5', 'sastrabudi@gmail.com', 145000, '2020-05-14 04:47:56'),
('payment_evaCnNGc', 3, '', '5ebcd2f37d674631dda4e9fb', 'sastrabudi@gmail.com', 100000, '2020-05-14 05:11:14'),
('payment_EYr2nJKX', 4, '', '5ebcd26b7d674631dda4e9fa', 'sastrabudi@gmail.com', 150000, '2020-05-14 05:08:58'),
('payment_Fy8CAfve', 0, 'R401', '5ec4ee990d071f1fd2597106', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_G1bD49dV', 0, 'R601', '5ed21bcc0d071f1fd259c2b9', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:39:40'),
('payment_GJ7qbF73', 0, 'R401', '5ec4e8a10d071f1fd25970ac', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_h8D73yld', 0, 'R601', '5ed21cfb0d071f1fd259c2d2', 'sastrabudi@gmail.com', 647063, '2020-05-30 08:44:43'),
('payment_HeX3cJU0', 0, 'R601', '5ed21c9e0d071f1fd259c2ca', 'sastrabudi@gmail.com', 2283750, '2020-05-30 08:43:10'),
('payment_II82Vn9U', 6, '', '5eb940cfd109a910df16a7fc', 'sastrabudi@gmail.com', 1450000, '2020-05-11 12:10:55'),
('payment_jhCUIoZr', 0, 'R401', '5ec4f0600d071f1fd2597114', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_KnXjPL9d', 0, 'R201', '5ed211d70d071f1fd259c272', 'sastrabudi@gmail.com', 22837500, '2020-05-30 07:57:11'),
('payment_mL4oRXh0', 0, 'R601', '5ed218610d071f1fd259c29c', 'sastrabudi@gmail.com', 2283750, '2020-05-30 08:25:05'),
('payment_nuvExLN9', 0, 'R601', '5ed22b290d071f1fd259c34d', 'sastrabudi@gmail.com', 833750, '2020-05-30 09:45:13'),
('payment_OCud34jt', 0, 'R601', '5ed21df90d071f1fd259c2da', 'sastrabudi@gmail.com', 108750, '2020-05-30 08:48:57'),
('payment_ooNZ3Pvh', 6, '', '', 'sastrabudi@gmail.com', 1450000, '2020-05-11 11:57:59'),
('payment_qYWX0pyY', 0, 'R601', '5ed21b7e0d071f1fd259c2b5', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:38:22'),
('payment_r1116tPR', 7, '', '5ebcd3ef7d674631dda4ea01', 'sastrabudi@gmail.com', 145000, '2020-05-14 05:15:26'),
('payment_rcJkHNnX', 5, '', '', 'sastrabudi@gmail.com', 145, '2020-05-11 11:56:17'),
('payment_RKEnLsLf', 0, '', '5ed251170d071f1fd259c425', 'william@gmail.com', 390, '2020-05-30 12:27:23'),
('payment_SkaHBDYn', 6, '', '', 'sastrabudi@gmail.com', 1450000, '2020-05-11 12:01:47'),
('payment_suNqcVPb', 6, '', '', 'sastrabudi@gmail.com', 1450000, '2020-05-11 12:00:51'),
('payment_Svlh0ldX', 0, 'R601', '5ed21da20d071f1fd259c2d6', 'sastrabudi@gmail.com', 2397938, '2020-05-30 08:47:30'),
('payment_SzqAe3gU', 6, '', '5ebba7eb27b1d72316eb37ff', 'sastrabudi@gmail.com', 1450000, '2020-05-13 07:55:24'),
('payment_t1OFFDDs', 0, 'R601', '5ed21b9e0d071f1fd259c2b7', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:38:54'),
('payment_tD4jsy53', 0, 'R601', '5ed219210d071f1fd259c2a2', 'sastrabudi@gmail.com', 833750, '2020-05-30 08:28:18'),
('payment_TfGdRl9s', 0, 'R601', '5ed21eb40d071f1fd259c2e1', 'sastrabudi@gmail.com', 108750, '2020-05-30 08:52:04'),
('payment_thxPLj1w', 0, 'R301', '5ec4e3270d071f1fd2597077', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_u0kFgnmk', 0, 'R401', '5ec4eef60d071f1fd2597108', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_UNpxnMuS', 0, 'R601', '5ed22ab50d071f1fd259c345', 'sastrabudi@gmail.com', 833750, '2020-05-30 09:43:17'),
('payment_wg3HrLC1', 0, 'R201', '5ed212000d071f1fd259c273', 'sastrabudi@gmail.com', 2283750, '2020-05-30 07:57:53'),
('payment_xeGPnTib', 0, 'R401', '5ec4f0d30d071f1fd2597122', 'sastrabudi@gmail.com', 2312750, '0000-00-00 00:00:00'),
('payment_XmPQu2m7', 0, 'R601', '5ed21b320d071f1fd259c2b1', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:37:06'),
('payment_XV7K2YqY', 0, 'R601', '5ed21bfe0d071f1fd259c2c6', 'sastrabudi@gmail.com', 10000, '2020-05-30 08:40:30'),
('payment_YRq7CmpB', 0, '3', '5ed22c440d071f1fd259c355', 'hotel@yahoo.com', 90000, '2020-05-30 09:49:56'),
('payment_YuAxkFam', 0, 'R601', '5ed21e530d071f1fd259c2dc', 'sastrabudi@gmail.com', 108750, '2020-05-30 08:50:27'),
('payment_zPNc4uYz', 5, '', '', 'sastrabudi@gmail.com', 145, '2020-05-11 11:55:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `request`
--

DROP TABLE IF EXISTS `request`;
CREATE TABLE `request` (
  `request_id` varchar(10) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `request_name` varchar(255) NOT NULL,
  `request_start` datetime NOT NULL,
  `request_end` datetime NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `status` int(11) NOT NULL COMMENT '1 reschedule diterima, 2 reschedule ditolak, 3 cancel diterima, 4 cancel ditolak, 5 reschedule menunggu pembayaran, 6 pembayaran gagal, 7 request canceled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `request`
--

INSERT INTO `request` (`request_id`, `booking_id`, `request_name`, `request_start`, `request_end`, `deskripsi`, `status`) VALUES
('R201', 2, 'Reschedule', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', 5),
('R301', 3, 'Cancel', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', 4),
('R302', 3, 'Cancel', '0000-00-00 00:00:00', '0000-00-00 00:00:00', '', 3),
('R401', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', '', 1),
('R402', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', 'undefined', 7),
('R403', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', 'undefined', 7),
('R404', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', 'undefined', 7),
('R405', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', 'undefined', 7),
('R406', 4, 'Reschedule', '2020-05-22 00:00:00', '2020-05-30 00:00:00', '', 2),
('R601', 6, 'Reschedule', '2020-05-12 00:00:00', '2020-05-13 00:00:00', '', 5),
('R602', 6, 'Reschedule', '2020-05-12 00:00:00', '2020-05-13 00:00:00', '', 5);

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `email` varchar(200) NOT NULL,
  `nohp` varchar(14) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_ktp` varchar(255) DEFAULT NULL,
  `tipe_user` varchar(1) NOT NULL COMMENT '1 untuk user biasa, 2 untuk hotel,3 untuk operator',
  `status_user` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`email`, `nohp`, `nama`, `password`, `foto_ktp`, `tipe_user`, `status_user`) VALUES
('hotel@yahoo.com', '0812345678', 'hotel', 'hotel', NULL, '2', '1'),
('sastrabudi@gmail.com', '085730708551', 'Budi Budi Budi', 'budi', '', '1', '1'),
('admin@gmail.com', '085730306554', 'admin', 'admin', './public/uploads/1590841480635.jpg', '3', '1'),
('william@gmail.com', '085730306554', 'William', 'ww', './public/uploads/1590841498375.jpg', '1', '1');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id_comment`);

--
-- Indeks untuk tabel `hbooking`
--
ALTER TABLE `hbooking`
  ADD PRIMARY KEY (`booking_id`);

--
-- Indeks untuk tabel `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`);

--
-- Indeks untuk tabel `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`request_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
