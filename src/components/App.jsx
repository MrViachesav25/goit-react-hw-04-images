
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Searchbar from './Searchbar';
import Loader from './Loader';
import ImageGallery from './ImageGallery';
import Button from './Button';

import { getImages} from 'service/take_images';
import { useEffect, useState } from 'react';
export default function App() {
  
  const [searchValue, setSearchValue] = useState('');
  const [images, setImages] = useState([]);
  const [totalHits, setTotalHits] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [theEnd, setTheEnd] = useState(false);
  

  const handleSubmit = query => {  
    if(searchValue !== query) {
      setSearchValue(query);
      setImages([]);
      setPage(1); 
      setTheEnd(false);
      setTotalHits(0);
    }
  };

  const addPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const destructData = data => {
    return data.map(({ id, tags, webformatURL, largeImageURL }) => {
      return { id, tags, webformatURL, largeImageURL };
    });
  }
  useEffect(() => {
    if(!searchValue) {
      setIsLoading(false);
      return;
    }
    const takeImages = async () => {
      try {
        setIsLoading(true);
        const data = await getImages(searchValue, page);
        if (data.data.hits.length && page === 1 ) {
          toast.success(<span>Excellent! We found {data.data.totalHits} images</span>, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
        if(!data.data.hits.length) {
          return toast.error(<span>Oops! We didn't find any image, my friend!</span>, {
            position: toast.POSITION.TOP_LEFT
          });
        }
        let theEnd = false;
        if(!data.data.hits.length || data.data.hits.length < 12) theEnd = true;
      
        const photos = destructData(data.data.hits);
        setImages(prevImages => [...prevImages, ...photos]);
        setTotalHits(data.data.totalHits);
        setIsLoading(false);
        setTheEnd(theEnd);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    takeImages();
  }, [searchValue, page, theEnd]);

  return (
      <>
        <Searchbar onSubmit={handleSubmit}/>
        {images.length > 0 && <ImageGallery
          images={images}
          searchValue={searchValue}
          totalHits={totalHits} />}
        {isLoading && <Loader/>}
        {!theEnd && images.length > 0 && <Button onClick={addPage}/>} 
        <ToastContainer />
      </>
    )
};
