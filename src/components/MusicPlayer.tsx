import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat } from 'lucide-react';

interface MusicPlayerProps {
  onBack: () => void;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  // duration: string;
  url: string;
  cover: string;
  genre: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Curated lofi tracks (using royalty-free/creative commons tracks)
  const tracks: Track[] = [

    // Ambient
    {
      id: 'ambient-1',
      title: 'Asleep',
      artist: 'Tomh',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103835/Tomh._-_Asleep_hrvxm4.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-2',
      title: 'Simulacra',
      artist: 'Scott Buckley',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103834/Scott_Buckley_-_Simulacra_khvw3i.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-3',
      title: 'Solitude',
      artist: 'Clavier',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103834/solitude-dark-ambient-music-354468-clavier_yexwvt.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-4',
      title: 'Waiting for this Moment',
      artist: 'Vlad Gluschenko',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103833/Vlad_Gluschenko_-_Waiting_for_this_Moment_uh0nlj.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-5',
      title: 'Meanwhile',
      artist: 'Scott Buckley',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103831/Scott_Buckley_-_Meanwhile_cxcofu.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-6',
      title: 'With You',
      artist: 'Onycs',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103822/Onycs_-_With_You_og1li8.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-7',
      title: 'Voyager',
      artist: 'Onycs',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103819/Onycs_-_Voyager_u04qhx.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-8',
      title: 'Shine',
      artist: 'Onycs',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103814/Onycs_-_Shine_mnzsv3.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-9',
      title: 'Bloom',
      artist: 'Onycs',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103804/Onycs_-_Bloom_sgj3fu.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-10',
      title: 'Ambient Background',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103802/ambient-background-339939_cjqqlv.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-11',
      title: 'Cellar Door',
      artist: 'Tunetank',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103801/cellar-door-347437-tunetank_ynvqhw.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-12',
      title: 'Two Places',
      artist: 'A Himitsu',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103801/A_Himitsu_-_Two_Places_vvzawh.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-13',
      title: 'The Flow of Time',
      artist: 'Alex Productions',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103801/Alex_Productions_-_The_Flow_of_Time_nfh6ie.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-14',
      title: '2184',
      artist: 'Miguel Jhonson',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103798/Miguel_Johnson_-_2184_gqjx9u.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },
    {
      id: 'ambient-15',
      title: 'A Horrid Discovery',
      artist: 'Aila Scott',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103797/Aila_Scott_-_A_Horrid_Discovery_glgw2x.mp3',
      cover: 'https://images.pexels.com/photos/1529881/pexels-photo-1529881.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'ambient'
    },

    // Chill
    {
      id: 'chill-1',
      title: 'Invented Rooms',
      artist: 'Savfk',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103965/Savfk_-_Invented_Rooms_kqmhde.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-2',
      title: 'Serenity',
      artist: 'Roa',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103955/Roa_-_Serenity_nvvncf.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-3',
      title: 'Waters Edge',
      artist: 'Pyrosion',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103953/Pyrosion_-_Waters_Edge_tal9ps.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-4',
      title: 'Speechless',
      artist: 'Pyrosion',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103938/Pyrosion_-_Speechless_e27mdm.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-5',
      title: 'Let Me Take You On A Ride',
      artist: 'Pyrosion',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103937/Pyrosion_-_Let_Me_Take_You_On_A_Ride_tso84a.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-6',
      title: 'Rebirth',
      artist: 'Onycs',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103936/Onycs_-_Rebirth_jmudei.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-7',
      title: 'Momentum',
      artist: 'Nomyn',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103935/Nomyn_-_Momentum_eklwuc.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-8',
      title: 'You Always Carry the Sun in Your Hands For Me',
      artist: 'Nikos Spiliotis',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103924/Nikos_Spiliotis_-_You_Always_Carry_the_Sun_in_Your_hands_for_me_mhuhon.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-9',
      title: 'Vibe',
      artist: 'Mehul Choudhary',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103919/Mehul_Choudhary_-_Vibe_joaopl.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-10',
      title: 'Lofi Beat Chill',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103917/lofi-beat-chill-7373_gdfy6k.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-11',
      title: 'Bubbles',
      artist: 'Kaiji',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103915/Kaiji_-_Bubbles_hx6grf.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-12',
      title: 'St. Francis',
      artist: 'Josh Lippi',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103908/Josh_Lippi_The_Overtimers_-_St._Francis_ysbtah.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-13',
      title: 'Train Robbery',
      artist: 'Hayden Folker',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103908/Hayden_Folker_-_Train_Robbery_xqgbp7.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-14',
      title: 'Summer Breeze',
      artist: 'Aftertune',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103906/Aftertune_-_Summer_Breeze_womg8d.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    {
      id: 'chill-15',
      title: '3 A.M.',
      artist: 'Aftertune',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751103905/Aftertune_-_3_A.M._gatwfr.mp3',
      cover: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'chill'
    },
    

    // Sleep
    {
      id: 'sleep-1',
      title: 'Relaxing Birds',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104072/relaxing-birds-and-piano-music-137153_xqp00t.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-2',
      title: 'Sleep Music',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104065/sleep-music-vol16-195422_rzsieo.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-3',
      title: 'Relaxing Music',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104057/relaxing-music-vol1-124477_iatw9f.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-4',
      title: 'The Cradle Of Your Soul',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104050/the-cradle-of-your-soul-15700_uedp7h.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-5',
      title: 'Soft Piano Music',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104046/soft-piano-music-358051_lb3wno.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-6',
      title: 'Perfect Beauty',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104042/perfect-beauty-191271_vjo1mt.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-7',
      title: 'Samurai Relaxing Flute',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104041/samurai-relaxing-flute-ethereal-flute-relaxing-meditation-music-365762_unlvlk.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-8',
      title: 'Morning In The Forest',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104039/morning-in-the-forest-347089_hpqxi5.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-9',
      title: 'Nature Walk',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104030/nature-walk-124997_r56iio.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-10',
      title: 'Melody Of Nature',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104023/melody-of-nature-main-6672_rlwlp5.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-11',
      title: 'Forest Lullaby',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104020/forest-lullaby-110624_yepebg.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-12',
      title: 'Breath Of Life',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104012/breath-of-life_10-minutes-320859_ubkk6u.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-13',
      title: '432Hz Meditation',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104009/432hz-meditation-355839_jmh8vt.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-14',
      title: 'Soft Piano',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104044/soft-piano-music-312509_ji4g8u.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },
    {
      id: 'sleep-15',
      title: 'Meditation Music',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104030/meditation-music-without-nature-sound-256142_colnt6.mp3',
      cover: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'sleep'
    },

    // Study
    {
      id: 'study-1',
      title: 'Whip Afro Dancehall',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751106724/whip-afro-dancehall-music-110235_tiwsxi.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-2',
      title: 'Study Time',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751106708/study-time-113549_hx3c11.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-3',
      title: 'Study',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751106708/study-110111_fuczpk.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-4',
      title: 'Simple Happy Life',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751106705/simple-happy-life-353819_mhx24c.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-5',
      title: 'Sapphire',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751106485/sapphire-2025-346224_lqj8rg.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-6',
      title: 'Please Calm My Mind',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104124/please-calm-my-mind-125566_jvsnez.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-7',
      title: 'Majestic Sky',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104123/majestic-sky-361090_g3hgb5.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-8',
      title: 'Nothing But Time',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104123/nothing-but-time-lo-fi-background-music-for-video-full-version-364138_d2wpel.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-9',
      title: 'Just Relax',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104121/just-relax-11157_hujyot.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-10',
      title: 'Inner Peace',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104111/inner-peace-339640_cptf0v.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-11',
      title: 'Jungle Waves',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104108/jungle-waves-drumampbass-electronic-inspiring-promo-345013_ku0i3z.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-12',
      title: 'Gorila',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104105/gorila-315977_tr2o3k.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-13',
      title: 'Gardens',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104097/gardens-stylish-chill-303261_vqdmi8.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-14',
      title: 'Calm Soft Music',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104096/calm-soft-background-music-357212_xzarbx.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    },
    {
      id: 'study-15',
      title: 'By The Riverside',
      artist: 'Anonymous',
      url: 'https://res.cloudinary.com/dhn92qb61/video/upload/v1751104095/by-the-riverside_medium-1-361080_xxxzgn.mp3',
      cover: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=300',
      genre: 'study'
    }
    
  ];

  const genres = ['all', 'ambient', 'chill', 'sleep', 'study'];
  const filteredTracks = selectedGenre === 'all' 
  ? tracks || [] 
  : (tracks || []).filter(track => 
      track.genre?.toLowerCase() === selectedGenre?.toLowerCase()
    );

  useEffect(() => {
    // Reset to first track when genre changes
    setCurrentTrack(0);
  }, [selectedGenre]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('mindease_favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const nextTrack = useCallback(() => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      setCurrentTrack(randomIndex);
    } else {
      setCurrentTrack((prev) => (prev + 1) % filteredTracks.length);
    }
  }, [isShuffled, filteredTracks.length]);

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + filteredTracks.length) % filteredTracks.length);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeatMode === 'all' || currentTrack < filteredTracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, repeatMode, filteredTracks.length, nextTrack]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFavorite = (trackId: string) => {
    const newFavorites = favorites.includes(trackId)
      ? favorites.filter(id => id !== trackId)
      : [...favorites, trackId];
    
    setFavorites(newFavorites);
    localStorage.setItem('mindease_favorites', JSON.stringify(newFavorites));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTrackData = filteredTracks[currentTrack];

  return (
    <div className="max-w-md mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Lofi Music</h1>
        <div className="w-9"></div>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedGenre === genre
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </button>
        ))}
      </div>

      {/* Current Track Display */}
      {currentTrackData && (
        <div className="bg-gradient-to-br from-purple-500 to-emerald-500 rounded-3xl p-6 mb-6 text-white">
          <div className="text-center mb-6">
            <img
              src={currentTrackData.cover}
              loading='lazy'
              alt={currentTrackData.title}
              className="w-48 h-48 rounded-2xl mx-auto mb-4 shadow-lg"
            />
            <h2 className="text-xl font-bold mb-1 capitalize">{currentTrackData.title}</h2>
            <p className="text-purple-100 capitalize">{currentTrackData.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-purple-100 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2 rounded-lg transition-colors ${
                isShuffled ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            
            <button
              onClick={prevTrack}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={togglePlay}
              className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            
            <button
              onClick={nextTrack}
              className="p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => setRepeatMode(
                repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off'
              )}
              className={`p-2 rounded-lg transition-colors ${
                repeatMode !== 'off' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 'one' && (
                <span className="absolute -mt-6 -mr-2 text-xs bg-white text-purple-500 rounded-full w-4 h-4 flex items-center justify-center">1</span>
              )}
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <button onClick={toggleMute} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Playlist</h3>
        {filteredTracks.map((track, index) => (
          <div
            key={track.id}
            onClick={() => setCurrentTrack(index)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
              index === currentTrack
                ? 'bg-purple-50 border-2 border-purple-200'
                : 'bg-white border border-gray-200 hover:shadow-md'
            }`}
          >
            <img
              src={track.cover}
              loading='lazy'
              alt={track.title}
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1 capitalize">
              <h4 className={`font-semibold ${
                index === currentTrack ? 'text-purple-800' : 'text-gray-800' 
              }`}>
                {track.title}
              </h4>
              <p className="text-sm text-gray-600">{track.artist}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(track.id);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  favorites.includes(track.id)
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(track.id) ? 'fill-current' : ''}`} />
              </button>
              {/* <span className="text-sm text-gray-500">{track.duration}</span> */}
            </div>
          </div>
        ))}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrackData?.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .slider::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `
      }} />
    </div>
  );
};