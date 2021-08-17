import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Flex,
  Input,
  Text,
  Heading,
  Spinner,
  ScaleFade,
  useDisclosure,
  Box,
  calc,
} from "@chakra-ui/react";
import ReactCrop from "react-image-crop";

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

  const getArrowData = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //   console.log(e);
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
        onToggle();
      }
      setImgLoading(false);
    }, 2000);
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const removeCircle = () => {
    const arrowCircle = document.getElementById("arrowDragCircle");
    arrowCircle!.style.width = "500px";
    arrowCircle!.style.height = "500px";
    arrowCircle!.style.opacity = "0";
    arrowCircle!.style.marginLeft = "-250px";
    arrowCircle!.style.marginTop = "-250px";
    //   arrowCircle!.style.display = 'none';
    arrowCircle!.style.transition = "300ms ease";
  };

  return (
    <Flex
      flexDirection="column"
      h="100vh"
      w="100vw"
      justify="center"
      align="center"
      onMouseMove={(e) => getArrowData(e)}
    >
      <Flex
        flexDir="column"
        justify="center"
        align="center"
        bgColor="gray.200"
        overflow="hidden"
        maxHeight="70%"
        maxWidth="70%"
        minHeight="50%"
        minWidth="50%"
        h={upImg ? "fit-content" : "50%"}
        w={upImg ? "fit-content" : "50%"}
        borderRadius={7}
        pos="relative"
        cursor="pointer"
        border={upImg ? "2px solid black" : ""}
        padding={upImg ? 1 : 0}
        zIndex={1}
      >
        {/* <Box
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
            top: `calc(${arrowY}px - 25vh)`,
            left: `calc(${arrowX}px - 25vw)`,
          }}
        ></Box> */}
        {upImg ? (
          <ScaleFade initialScale={0.1} in={isOpen}>
            <ReactCrop
              src={upImg}
              onChange={(newCrop) => setCrop(newCrop)}
              crop={crop}
              onImageLoaded={onLoad}
              onComplete={(cropped) => setCompletedCrop(cropped)}
              onImageError={(e) => alert(e)}
            />
          </ScaleFade>
        ) : (
          <>
            <Input
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
            ) : (
              <></>
            )}
            <Heading pos="absolute" top="40%" color="gray.400">
              Drop Your Image Here
            </Heading>
          </>
        )}
      </Flex>
      <div>
        <canvas
          ref={previewCanvasRef}
          style={{
            width: Math.round(completedCrop?.width ?? 0),
            height: Math.round(completedCrop?.height ?? 0),
          }}
        />
      </div>
    </Flex>
  );
};

export default ImageCropArea;
