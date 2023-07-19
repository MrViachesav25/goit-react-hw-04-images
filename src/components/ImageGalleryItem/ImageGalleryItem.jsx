import PropTypes from 'prop-types';

import Modal from 'components/Modal';
import { useState } from 'react';

export default function ImageGalleryItem(props) {
    const [isOpen, setIsOpen] = useState(false);
    
    const clickModal = () => {
        setIsOpen(!isOpen);
    }

    const {image: { tags, webformatURL, largeImageURL}} = props;
    return (
        <li className="ImageGalleryItem">
            <img className="ImageGalleryItem-image" src={webformatURL} alt={tags} onClick={clickModal}/>
            {isOpen && (<Modal largeImageURL={largeImageURL} tags={tags} onCloseModal={clickModal}/>)}
        </li>
    )
}

ImageGalleryItem.propTypes = {
    image: PropTypes.shape({
        tags: PropTypes.string.isRequired,
        webformatURL: PropTypes.string.isRequired,
        largeImageURL: PropTypes.string.isRequired,
    }).isRequired,
};