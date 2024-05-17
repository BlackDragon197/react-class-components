import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Tooltip from "./Tooltip";

const styles = {
  hidden: {
    height: 1,
    width: 1
  },
  wrapper: {
    padding: 70,
    border: '1px ​solid #eaeaea',
    borderRadius: 4,
    textAlign: 'center',
    background: '#f2f2f2',
    position: 'relative',
    overflow: 'hidden',

    '& > span': {
      position: 'relative'
    },

    '& .select-bar': {
      display: 'none',
      bottom: 0,
      zIndex: 2,
      position: 'absolute',
      background: 'rgba(42,42,42,0.5)',
      width: '100%',
      left: 0,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '5px 0',
      color: '#fff'
    }
  },
  uploadButton: {
    marginLeft: 5
  },
  preview: {
    height: 195,
    width: '100%',
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    objectFit: 'contain',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    color: '#353535',
    marginTop: 0,
    display: 'inline-block',
    marginRight: 15
  },
  withPreview: {
    cursor: 'pointer',

    '&:hover .select-bar': {
      display: 'flex'
    }
  }
};

const UploadWithPreview = forwardRef(({
  classes,
  defaultValue,
  label,
  tooltip,
  tooltipPosition
}, ref) => {
  const fileInputRef = useRef();
  const [canDrop, setCanDrop] = useState(false);
  const [file, setFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    setPreview(defaultValue);
  }, [defaultValue]);

  useImperativeHandle(ref, () => ({
    getFile() {
      return file;
    }
  }));

  const onAddFile = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    setFile(file);
  };

  const showFileDialog = e => {
    e.preventDefault();
    const { current } = fileInputRef;

    if (current) {
      current.click();
    }
  }

  const onDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    onAddFile({
      target: {
        files: e.dataTransfer.files
      }
    })
    setCanDrop(false);
  }

  const onDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    setCanDrop(true);
  }

  const onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setCanDrop(false);
  }

  const preventDragHandler = e => {
    e.preventDefault();
  }

  return (
    <>
      {label && <h5 className={classes.label}>{label}</h5>}
      {tooltip && <Tooltip content={tooltip} position={tooltipPosition}/>}
      <div
        className={classNames(classes.wrapper, {[classes.withPreview]: preview})}
        onDrop={onDrop}
        onDragEnter={onDrag}
        onDragOver={preventDragHandler}
        onDragLeave={onDragLeave}
      >
        {preview && (
          <div onClick={e => showFileDialog(e)}>
            <img src={preview} className={classes.preview} />
            <div className={'select-bar'}>
              <PhotoCameraIcon />{' '}
              <FormattedMessage id={'select_another_file'} defaultMessage={'Select another file'} />
            </div>
          </div>
        )}
        <input type={'file'} ref={fileInputRef} className={classes.hidden} accept="image/*" onChange={onAddFile}/>
        {
          !preview && (
            <>
              {
                canDrop && (
                  <FormattedMessage id={'drop_the_image'} defaultMessage={'Drop the image to be selected'} />
                )
              }
              {
                !canDrop && (
                  <>
                    <FormattedMessage id={'drag_an_image'} defaultMessage={'Drag an image or'} />{' '}
                    <Button onClick={showFileDialog} variant={'contained'} color={'primary'} className={classes.uploadButton}>
                      <FormattedMessage id={'select_file'} defaultMessage={'Select file'} />
                    </Button>
                  </>
                )
              }
            </>
          )
        }
      </div>
    </>
  );
});

export default withStyles(styles)(UploadWithPreview);