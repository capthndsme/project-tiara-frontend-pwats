import { useEffect, useRef, useState } from "react";

import { SimpleBackButton } from "../Components/SimpleBackButton";
import { TopBar } from "../Components/TopBar";
import { socket } from "../Components/socket";
import { Imagery } from "../Types/Imagery";
import { BsGrid, BsArrowDownCircle, BsCloudDownload } from "react-icons/bs";
import moment from "moment";

export function Images() {
	const [images, setImages] = useState<Imagery[]>([]);
	const [uiShow, setUiShow] = useState(true);
	const [gridMode, setGridMode] = useState(false);
	const [quality, setQuality] = useState("-small.jpg");
	const [activeIndex, setActiveIndex] = useState(0);
   const gridRef = useRef<HTMLDivElement>(null);
	const [activeImage, setActiveImage] = useState<Imagery | null>(null);
	useEffect(() => {
		socket.emit("GetImages", {}, (data: Imagery[]) => {
			console.log("Got images");
			setImages(data);
			setQuality("-small.jpg");
			setActiveIndex(0);
			setActiveImage(data[0]);
		});
	}, []);
	if (images.length === 0) {
		return (
			<div
				className="fullscreen"
				style={{
					background: "black",
					zIndex: 20,
					left: 0,
					position: "fixed",
					top: 0,
				}}
			>
				Loading
			</div>
		);
	}
 
	return (
		<div
			className="fullscreen"
			style={{
				background: "black",
				zIndex: 20,
				left: 0,
				position: "fixed",
				top: 0,
			}}
		>
			<TopBar
				float={true}
				style={{
					transition: "transform 0.2s ease-in-out",
					transform: uiShow ? "translateY(0px)" : "translateY(-60px)",
				}}
			>
				<div
					style={{
						display: "grid",
						gridTemplateColumns: "50px 1fr 50px",
						width: "100%",
						height: "60px",
					}}
				>
					<div style={{ paddingLeft: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<SimpleBackButton
							optionalFn={
								gridMode
									? () => {
											setGridMode(false);
									  }
									: undefined
							}
						/>
					</div>

					<div style={{ lineHeight: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
						{moment(activeImage?.timestamp).fromNow()}
						<br />
						{moment(activeImage?.timestamp).format("YYYY-MM-DD HH:mm:ss")}
					</div>
					<a
						target="_blank"
						rel="noreferrer"
						href={(activeImage?.cdn ?? "") + activeImage?.fileHash + ".jpg"}
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "white",
							fontSize: 20,
							marginRight: 16,
						}}
						download={activeImage?.fileHash + ".jpg"}
					>
						<BsCloudDownload />
					</a>
				</div>
			</TopBar>
			<img
			alt="Camera snapshot."
				onWheel={(e) => {
					if (gridMode) return;
               if (gridRef.current) {
                  gridRef.current.scrollTop = 0; // Unfuck when coming from Grid Mode.
                  if (e.deltaY < 0) {
                     // to left
                     if (activeIndex >= 0) {
                        setActiveIndex((index) => index - 1);
                        setActiveImage(images[activeIndex]);
                        setQuality("-small.jpg");
                        gridRef.current.scrollLeft = 80 * activeIndex - (gridRef.current.clientWidth / 2 - 40);
                     } else {
                        console.log("Maximum length");
                     }
                  } else {
                     // to right
                     if (activeIndex <= images.length - 1) {
                        setActiveIndex((index) => index + 1);
                        setActiveImage(images[activeIndex]);
                        setQuality("-small.jpg");
                        gridRef.current.scrollLeft = 80 * activeIndex - (gridRef.current.clientWidth / 2 - 40);
                     } else {
                        console.log("Maximum length");
                     }
                  }
               }
					
				}}
				style={{
					width: "100%",
					position: "fixed",
					top: 0,
					left: 0,
					height: "100%",
					objectFit: "contain",
				}}
				onClick={() => {
					setUiShow((show) => !show);
				}}
				onLoad={() => {
					// A simple lazy load.
					if (quality === "-small.jpg") {
						setQuality(".jpg");
					}
				}}
				src={(activeImage?.cdn ?? "") + activeImage?.fileHash + quality}
			></img>
			<button
				style={{
					transition: "transform 0.2s ease-in-out",
					position: "fixed",
					bottom: "110px",
					right: "calc(50% - 25px)",
					zIndex: 100,
					width: "50px",
					height: "50px",
					borderRadius: "50%",
					background: "rgba(0,0,0,0.5)",
					border: "none",
					color: "white",
					fontSize: "30px",
					paddingTop: 8,
					transform: gridMode || !uiShow ? (uiShow ? "translateY(80px)" : "translateY(160px)") : "translateY(0)",
					fontWeight: "bold",
					cursor: "pointer",
				}}
				onClick={() => {
					setGridMode((mode) => !mode);
				}}
			>
				{gridMode ? <BsArrowDownCircle /> : <BsGrid />}
			</button>
			<div
				style={{
 
					transform: uiShow ? "translateY(0)" : "translateY(130px)",
				}}
            ref={gridRef}
				className={gridMode && uiShow ? "gridMode helpAnimate" : "filmstripContainer helpAnimate"}
				onWheel={(e) => {
					if (gridMode) return;
					e.currentTarget.scrollTop = 0; // Unfuck when coming from Grid Mode.
					if (e.deltaY < 0) {
						// to left
						if (activeIndex >= 0) {
							setActiveIndex((index) => index - 1);
							setActiveImage(images[activeIndex]);
							setQuality("-small.jpg");
							e.currentTarget.scrollLeft = 80 * activeIndex - (e.currentTarget.clientWidth / 2 - 40);
						} else {
							console.log("Maximum length");
						}
					} else {
						// to right
						if (activeIndex <= images.length - 1) {
							setActiveIndex((index) => index + 1);
							setActiveImage(images[activeIndex]);
							setQuality("-small.jpg");
							e.currentTarget.scrollLeft = 80 * activeIndex - (e.currentTarget.clientWidth / 2 - 40);
						} else {
							console.log("Maximum length");
						}
					}
				}}
			>
				{images.map((image, index) => {
					return (
						<div
							key={image.timestamp}
							className={image === activeImage ? "filmstripImage activeBorder" : "filmstripImage"}
							onClick={() => {
								setGridMode(false);
								setActiveIndex(index);
								setActiveImage(image);
								setQuality("-small.jpg");
							}}
						>
							<img alt="thumbnail" src={(image.cdn ?? "") + image.fileHash + "-micro.jpg"} loading="lazy"></img>
						</div>
					);
				})}
			</div>
		</div>
	);
}
