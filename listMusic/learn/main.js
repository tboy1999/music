const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

/**
 * 1: render songs
 * 2: scroll top
 * 3: play / pause / seek
 * 4: cd rotarte
 * 5. next / prev
 * 6. random 
 * 7. next / repeat when ended
 * 8. active songs
 * 9. scroll active song into view
 * 10. play song when click
 */
const player = $('.player');
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {

    currentIndex: 0,
    songs: [{
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: '../songs/NangTho-HoangDung-6413381.mp3',
            image: '../img/nangtho.jpg'
        },
        {
            name: 'Anh Yêu Em',
            singer: 'Khắc Việt',
            path: '../songs/AnhYeuEm-KhacViet-4813805.mp3',
            image: '../img/anhyeuem.jpg'
        },
        {
            name: 'Có Không Giữ Mất Đừng Tìm',
            singer: 'Cảnh Minh',
            path: '../songs/CoKhongGiuMatDungTim-CanhMinh-3847487.mp3',
            image: '../img/cokhonggiumatdungtim.jpg'
        },
        {
            name: 'Nếu Là Anh',
            singer: 'The Men',
            path: '../songs/NeuLaAnh-TheMen-2729808.mp3',
            image: '../img/neulaanh.jpg'
        },
        {
            name: 'Thế Thái',
            singer: 'Hương Ly',
            path: '../songs/TheThai-HuongLy-6728509.mp3',
            image: '../img/thethai.jpg'
        },
        {
            name: '24h',
            singer: 'Ly Ly',
            path: '../songs/24HRapAcoustic-LylyMagazine-6023071.mp3',
            image: '../img/24h.jpg'
        },
        {
            name: 'anh nhớ em',
            singer: 'An Coong',
            path: '../songs/AnhNhoEmPianoVersion-AnCoong-2744898.mp3',
            image: '../img/anhn nhớ em.jpg'
        },
        {
            name: 'bánh mỳ không',
            singer: 'đạt J',
            path: '../songs/BanhMiKhongPhamThanhRemix-DatGDuUyen-6183898.mp3',
            image: '../img/bánh mì không.jpg'
        },
        {
            name: 'lá xa lìa cành',
            singer: 'lê bảo bình',
            path: '../songs/LaXaLiaCanhPhamThanhRemix-LeBaoBinh-6204149.mp3',
            image: '../img/download.jpg'
        },

    ],



    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    render: function() {
        const htmls = this.songs.map((item, index) => {
            return `        
        <div data-index="${index}" class="song ${
        index === this.currentIndex ? 'active' : ''
      }">
            <div
                class="thumb"
                style="
                background-image: url('${item.image}');
            "
            ></div>
            <div class="body">
                <h3 class="title">${item.name}</h3>
                <p class="author">${item.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`;
        });
        $('.playlist').innerHTML = htmls.join('');
    },

    handleEvent() {
        const cdwidth = cd.offsetWidth
        const isPlaying = false
        const isRandom = false
        const _this = this
        const isRepeat = false


        //xử lý CD quay / đứng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })

        cdThumbAnimate.pause()


        //xử lý phóng to / thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdwidth = cdwidth - scrollTop

            cd.style.width = newCdwidth > 0 ? newCdwidth + 'px' : 0
            cd.style.opacity = newCdwidth / cdwidth
        }

        // xử lý khi click play
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // xử lý khi song dc play
        audio.onplay = function() {
            app.isPlaying = true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }

        // xử lý khi bị pause
        audio.onpause = function() {
            app.isPlaying = false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }

        // xử lý khi đang chạy videos

        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // xử lý tua video
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // xử lý next bài hát
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
                audio.play()
            } else {
                _this.nextSong()
                audio.play()
            }
            _this.scrollToActiveSong()
        }

        // xử lý khi prev song 
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
                audio.play()
            } else {
                _this.prevSong()
                audio.play()
            }
            _this.scrollToActiveSong()

        }

        // xử lý bật / tắt random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle("active", _this.isRandom)
        }

        //xử lý next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // xử lý repeat một song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle("active", _this.isrepeat)
        }

        // xử lý khi click vào bài Hát
        playlist.onclick = function(e) {
            const songNote = e.target.closest('.song:not(.active)')
            if (songNote || e.target.closest('.option')) {
                //xử lí khi click vào song
                if (songNote) {
                    _this.currentIndex = songNote.dataset.index
                    _this.loadCurrentSong()
                    audio.play()
                }

                //xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }



    },

    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

        if ($('.song.active')) {
            $('.song.active').classList.remove('active');
        }
        const list = $$('.song');
        list.forEach((song) => {
            if (song.dataset.index == this.currentIndex) {
                song.classList.add('active');
            }
        });

    },

    nextSong() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "end",
            })
        }, 300)
    },



    run() {

        // Định Nghĩa Các Thuộc Tính Cho Object
        this.defineProperties()

        // Lắng Nghe Và Sử Lý Các Sự Kiện
        this.handleEvent();

        // Tải Thông Tin Bài Hát Đầu Tiên Vào UI Khi Chạy Ứng Dụng
        this.loadCurrentSong();

        //render playlist
        this.render();

    }
}

app.run()