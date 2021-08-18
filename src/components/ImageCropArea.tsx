import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Flex,
  Input,
  Button,
  Heading,
  Spinner,
  Fade,
  useDisclosure,
  Image,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import ReactCrop from "react-image-crop";
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { BiArrowBack } from "react-icons/bi";

const ImageCropArea = () => {
  const imgRef = useRef();
  const previewCanvasRef = useRef(null);
  const [arrowX, setArrowX] = useState<number>();
  const [arrowY, setArrowY] = useState<number>();
  const [crop, setCrop] = useState<ReactCrop.Crop>();
  const [upImg, setUpImg] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<ReactCrop.Crop | null>(null);
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const { isOpen, onToggle } = useDisclosure();
  const [editImage, setEditImage] = useState<boolean>(false);

  console.log(editImage);

  const getArrowData = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setArrowX(e.pageX);
    setArrowY(e.pageY);
  };

  const onSelectFile = (e: any) => {
    setImgLoading(true);
    setTimeout(() => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener("load", () => setUpImg(reader.result as string));
        reader.readAsDataURL(e.target.files[0]);
        setImgLoading(false);
        onToggle();
      }
    }, 2000);
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const downloadImage = (canvas: any, crop: ReactCrop.Crop) => {
    if (!crop || !canvas) {
      return;
    }

    canvas.toBlob(
      (blob: any) => {
        const previewUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.download = "Preview Image";
        anchor.href = previewUrl;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(previewUrl);
      },
      "image/png",
      1
    );
  };

  useEffect(() => {
    if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
      return;
    }

    const image: any = imgRef.current;
    const canvas: any = previewCanvasRef.current;
    const crop = completedCrop;

    if (image && canvas && crop) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width! * pixelRatio * scaleX;
      canvas.height = crop.height! * pixelRatio * scaleY;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        image,
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
        0,
        0,
        crop.width! * scaleX,
        crop.height! * scaleY
      );
    }
  }, [completedCrop]);

  return (
    <div className="imageCropArea" onMouseMove={(e) => getArrowData(e)}>
      <Heading
        className="imageCropArea__heading"
        marginBottom={2}
        textColor="gray.600"
        background="linear-gradient(90deg, rgba(234,111,155,1) 0%, rgba(246,198,134,1) 33%, rgba(121,205,195,1) 71%, rgba(0,212,255,1) 100%)"
        textAlign="center"
        paddingBottom='10px'
        // margin="10 auto"
      >
        Image Cropper
      </Heading>
      <Flex
        className="imageCropArea__imageContainer"
        flexDir="column"
        justify="center"
        align="center"
        bgColor="gray.200"
        overflow="hidden"
        maxWidth="60%"
        minHeight="30%"
        minWidth="30%"
        h={upImg ? "fit-content" : "50%"}
        w={upImg ? "fit-content" : "50%"}
        borderRadius={7}
        pos="relative"
        border={upImg ? "2px solid black" : ""}
        padding={0}
        zIndex={1}
        margin="0 auto"
        sx={{
          "@media (max-width: 1100px)": {
            height: upImg ? "fit-content" : "70%",
            width: upImg ? "fit-content" : "70%",
            maxWidth: "80%",
          },
          "@media (max-width: 700px)": {
            height: upImg ? "fit-content" : "50%",
            width: upImg ? "fit-content" : "96%",
            maxWidth: "100%",
          },
        }}
      >
        {upImg ? (
          <div
            className="imageCropArea__iconButton"
            style={{
              textAlign: "center",
              position: "absolute",
              bottom: 0,
              zIndex: 2,
              marginBottom: "20px",
            }}
          >
            <Fade in={isOpen} style={{ transition: "300ms", transitionDelay: "500ms" }}>
              <IconButton
                colorScheme="red"
                aria-label="DeleteImageButton"
                borderRadius="50%"
                size="lg"
                marginRight={3}
                onClick={() => {
                  setUpImg("");
                  setCrop(undefined);
                  setCompletedCrop(null);
                  imgRef.current = undefined;
                  previewCanvasRef.current = null;
                  onToggle();
                }}
                sx={{
                  "@media (max-width: 1100px)": {
                    minWidth: '40px ',
                    height: '40px '
                  },
                  "@media (max-width: 700px)": {
                    minWidth: '30px',
                    height: '30px'
                  },
                }}
              >
                <MdDelete
                  style={{ fontSize: "30px" }}
                  className='imageCropArea__deleteImage'
                />
              </IconButton>
              {!editImage ? (
                <IconButton
                  colorScheme="green"
                  aria-label="EditImageCropButton"
                  borderRadius="50%"
                  size="lg"
                  onClick={() => {
                    setEditImage(!editImage);
                  }}
                  sx={{
                    "@media (max-width: 1100px)": {
                      minWidth: '40px ',
                      height: '40px '
                    },
                    "@media (max-width: 700px)": {
                      minWidth: '30px',
                      height: '30px'
                    },
                  }}
                >
                  <RiPencilFill className='imageCropArea__pencilImage' style={{ fontSize: "30px" }} />
                </IconButton>
              ) : (
                <IconButton
                  colorScheme="green"
                  aria-label="EditImageCropButton"
                  borderRadius="50%"
                  size="lg"
                  onClick={() => {
                    setEditImage(!editImage);
                  }}
                  sx={{
                    "@media (max-width: 1100px)": {
                      minWidth: '40px ',
                      height: '40px '
                    },
                    "@media (max-width: 700px)": {
                      minWidth: '30px',
                      height: '30px'
                    },
                  }}
                >
                  <BiArrowBack className='imageCropArea__backArrowImage' style={{ fontSize: "30px" }} />
                </IconButton>
              )}
            </Fade>
          </div>
        ) : null}

        {upImg ? (
          editImage ? (
            <Fade in={isOpen} style={{ height: "fit-content", transition: "200ms" }}>
              <ReactCrop
                src={upImg}
                onChange={(newCrop) => setCrop(newCrop)}
                crop={crop}
                onImageLoaded={onLoad}
                onComplete={(cropped) => setCompletedCrop(cropped)}
                onImageError={(e) => alert(e)}
                ruleOfThirds={true}
              />
            </Fade>
          ) : (
            <Fade in={isOpen} style={{ transition: "200ms" }}>
              <Image src={upImg} cursor="initial" />
            </Fade>
          )
        ) : (
          <>
            <Input
              id="droppableArea"
              className="inputTypeFile"
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              placeholder="Upload Image here"
              h="100%"
              d="flex"
              justify="center"
              align="center"
            />
            {imgLoading ? (
              <Spinner zIndex="100" position="absolute" top="0" right="0" margin={3} />
            ) : null}
            <Heading
              pos="absolute"
              top="40%"
              color="gray.400"
              cursor="default"
              onClick={() => {
                document.getElementById("droppableArea")?.click();
                }}
                sx={{
                  "@media (max-width: 390px)": {
                     fontSize: '20px' 
                  }
                }}
            >
              Drop Your Image Here
            </Heading>
          </>
        )}
      </Flex>
      {completedCrop?.width || completedCrop?.height ? (
        <div style={{ marginTop: "10px", width: '100%' }} className="imageCropArea__preview">
          <Divider height={2} background="linear-gradient(90deg, rgba(234,111,155,1) 0%, rgba(246,198,134,1) 33%, rgba(121,205,195,1) 71%, rgba(0,212,255,1) 100%)" />
          <Heading textAlign="center" marginBottom={2}>
            Preview
          </Heading>
          <canvas
            ref={previewCanvasRef}
            className='imageCropArea__canvas'
            style={{
              width: '50%',
              height: '100%',
              margin: "0 auto",
              border: "1px solid black",
            }}
          />
        </div>
      ) : null}

      {completedCrop?.width || completedCrop?.height ? (
        <div
          style={{ textAlign: "center", marginTop: "10px" }}
          className="imageCropArea__downloadButton"
        >
          <Button
            colorScheme="blue"
            disabled={!completedCrop?.width || !completedCrop?.height}
            onClick={() => downloadImage(previewCanvasRef.current, completedCrop)}
          >
            Download Cropped Image
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ImageCropArea;
