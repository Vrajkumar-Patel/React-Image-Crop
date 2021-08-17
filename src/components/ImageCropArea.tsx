import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Flex,
  Input,
  Button,
  Text,
  Heading,
  Spinner,
  Fade,
  ScaleFade,
  useDisclosure,
  Box,
  Divider,
  IconButton,
} from "@chakra-ui/react";
import ReactCrop from "react-image-crop";
import { MdDelete } from "react-icons/md";

const ImageCropArea = () => {
  const imgRef = useRef();
  const previewCanvasRef = useRef(null);
  const [arrowX, setArrowX] = useState<number>();
  const [arrowY, setArrowY] = useState<number>();
  const [crop, setCrop] = useState<ReactCrop.Crop>();
  const [upImg, setUpImg] = useState<string>();
  const [completedCrop, setCompletedCrop] = useState<ReactCrop.Crop | null>(null);
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [showIcons, setShowIcons] = useState<boolean>(false);
  const { isOpen, onToggle } = useDisclosure();
  const [draggingOver, setDraggingOver] = useState<boolean>(false);
  const [draggingEnd, setDraggingEnd] = useState<boolean>(false);

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

  //   const removeCircle = () => {
  //     const arrowCircle = document.getElementById("arrowDragCircle");
  //     arrowCircle!.style.width = "500px";
  //     arrowCircle!.style.height = "500px";
  //     arrowCircle!.style.opacity = "0";
  //     arrowCircle!.style.marginLeft = "-250px";
  //     arrowCircle!.style.marginTop = "-250px";
  //     arrowCircle!.style.display = "none";
  //     arrowCircle!.style.transition = "300ms ease";
  //   };

  return (
    <div className="imageCropArea" onMouseMove={(e) => getArrowData(e)}>
      <Flex
        flexDir="column"
        justify="center"
        align="center"
        bgColor="gray.200"
        overflow="hidden"
        // maxHeight="60%"
        maxWidth="60%"
        h={upImg ? "fit-content" : "50%"}
        w={upImg ? "fit-content" : "50%"}
        borderRadius={7}
        pos="relative"
        cursor="none"
        border={upImg ? "2px solid black" : ""}
        padding={0}
        zIndex={1}
        margin="0 auto"
      >
        {/* <div
              style={{
                position: "absolute",
                top: `calc(${arrowY}px)`,
                left: `calc(${arrowX}px - 25vw)`,
                minWidth: "400px",
                minHeight: "400px",
                // background: "red",
                border: "100px solid gray",
                borderRadius: "50%",
                zIndex: 100,
              }}
            ></div> */}
        {/* {draggingOver ? (
          <Box
            id="arrowDragCircle"
            marginTop={-10}
            marginLeft={-10}
            cursor="initial"
            width={20}
            height={20}
            borderRadius="50%"
            backgroundColor="gray.300"
            opacity="0.6"
            zIndex={2}
            onClick={removeCircle}
            style={{
              position: "absolute",
              top: `calc(${arrowY}px)`,
              left: `calc(${arrowX}px - 25vw)`,
            }}
          ></Box>
        ) : (
          <></>
        )} */}

        {upImg ? (
          <div
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
                //   padding='10px'
                onClick={() => {
                  setUpImg("");
                  setCrop(undefined);
                  setCompletedCrop(null);
                  imgRef.current = undefined;
                  previewCanvasRef.current = null;
                  onToggle();
                }}
              >
                <MdDelete style={{ fontSize: "30px" }} />
              </IconButton>
            </Fade>
          </div>
        ) : null}

        {upImg ? (
          <Fade in={isOpen} style={{ transition: "all 0.2s" }}>
            <ReactCrop
              src={upImg}
              onChange={(newCrop) => setCrop(newCrop)}
              crop={crop}
              onImageLoaded={onLoad}
              onComplete={(cropped) => setCompletedCrop(cropped)}
              onImageError={(e) => alert(e)}
            />
          </Fade>
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
              cursor={draggingOver ? "cell" : "pointer"}
              onDragOver={(e) => {
                console.log(e);
                setDraggingOver(true);
                document.getElementById("droppableArea")!.style.cursor = "pointer";
              }}
              onDrop={() => {
                setDraggingOver(false);
                setDraggingOver(true);
              }}
            />
            {imgLoading ? (
              <Spinner zIndex="100" position="absolute" top="0" right="0" margin={3} />
            ) : null}
            <Heading pos="absolute" top="40%" color="gray.400">
              Drop Your Image Here
            </Heading>
          </>
        )}
      </Flex>
      {completedCrop?.width || completedCrop?.height ? (
        <div>
          <Heading textAlign="center">Preview</Heading>
          <br />
          <canvas
            ref={previewCanvasRef}
            style={{
              width: Math.round(completedCrop?.width ?? 0),
              height: Math.round(completedCrop?.height ?? 0),
              margin: "0 auto",
              border: "1px solid black",
            }}
          />
        </div>
      ) : null}

      {completedCrop?.width || completedCrop?.height ? (
        <div style={{ textAlign: "center" }}>
          <br />
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
