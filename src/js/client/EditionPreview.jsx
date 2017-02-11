import React from 'react';
import Lightbox from 'react-images';

class EditionPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {lightboxIsOpen: false, currentImage: 0};
  }

  openLightbox(currentImage) {
    this.setState({lightboxIsOpen: true, currentImage: currentImage });
  }

  closeLightbox() {
    this.setState({lightboxIsOpen: false});
  }

  gotoPrevious() {
    this.setState({ currentImage: this.state.currentImage - 1 });
  }

  gotoNext() {
    this.setState({ currentImage: this.state.currentImage + 1 });
  }

  gotoImage(index) {
    this.setState({
      currentImage: index,
    });
  }

  gotoAuto() {
    if (this.state.currentImage == this.props.edition.images.length - 1) {
      this.setState({currentImage: 0});
      return;
    }

    this.gotoNext();
  }

  render() {
    var edition = this.props.edition;

    if (edition.images[0]) {
      var imageBase = '/ausgaben/' + edition.id + '/';
      var bigPreviewImage = imageBase + edition.images[0][200];
      var smallPreviewImages = edition.images.slice(1).map(image => 
        imageBase + image[100]
      );
      var lightboxImages = edition.images.map(image => ({
        src: imageBase + image[0],
        thumbnail: imageBase + image[100],
        caption: (/umschlag/.test(image[0])) ? 'Umschlag' :
                 (/einband/.test(image[0])) ? 'Einband' :
                 (/cover/.test(image[0])) ? 'Cover' :
                 (/titelseite/.test(image[0])) ? 'Titelseite' : null
      }));
      return (
        <div className="edition-preview">
          <img className="big-preview"
               src={bigPreviewImage}
               onClick={this.openLightbox.bind(this, 0)}/>

          <div>
          {smallPreviewImages.map((smallPreviewImage, i) =>
            <img key={i} className="small-preview"
                 src={smallPreviewImage}
                 onClick={this.openLightbox.bind(this, i+1)}/>
          )}
          </div>

          <Lightbox
            images={lightboxImages}
            currentImage={this.state.currentImage}
            isOpen={this.state.lightboxIsOpen}
            onClose={this.closeLightbox.bind(this)}
            onClickNext={this.gotoNext.bind(this)}
            onClickPrev={this.gotoPrevious.bind(this)}
            onClickImage={this.gotoAuto.bind(this)}
            onClickThumbnail={this.gotoImage.bind(this)}
            showThumbnails={true}
            showImageCount={false}
            leftArrowTitle="Vorheriges Bild"
            rightArrowTitle="Nächstes Bild"
            closeButtonTitle="Schließen"
          />
        </div>
      );
    }
    return <span className="edition-preview">?</span>;
  }
}

export default EditionPreview;
