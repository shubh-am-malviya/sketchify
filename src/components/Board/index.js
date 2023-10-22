import { socket } from "@/socket";
import { actionItemClick } from "@/store/slices/menuSlice";
import { COLORS, MENU_ITEMS } from "@/utils/constant";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

const Board = () => {
	const dispatch = useDispatch();
	const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
	const { color, size } = useSelector((state) => state.toolBox[activeMenuItem]);

	const canvasRef = useRef(null);
	const shouldDraw = useRef(false);

	const drawHistory = useRef([]);
	const historyPointer = useRef(0);

	// before browser paint
	useLayoutEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d", { willReadFrequently: true });

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		context.fillStyle = COLORS.WHITE;
		context.fillRect(0, 0, canvas.width, canvas.height);

		const beginPath = (x, y) => {
			context.beginPath();
			context.moveTo(x, y);
		};

		const drawLine = (x, y) => {
			context.lineTo(x, y);
			context.stroke();
		};

		const saveHistory = () => {
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			drawHistory.current.push(imageData);
			historyPointer.current = drawHistory.current.length - 1;
		};

		const handleMouseDown = (e) => {
			shouldDraw.current = true;
			beginPath(e.clientX, e.clientY);
			socket.emit("beginPath", { x: e.clientX, y: e.clientY });
		};

		const handleMouseMove = (e) => {
			if (!shouldDraw.current) return;
			drawLine(e.clientX, e.clientY);
			socket.emit("drawLine", { x: e.clientX, y: e.clientY });
		};

		const handleMouseUp = () => {
			shouldDraw.current = false;
			saveHistory();
			socket.emit("drawLineCompleted", {});
		};

		const handleBeginPath = (path) => {
			beginPath(path.x, path.y);
		};

		const handleDrawLine = (path) => {
			drawLine(path.x, path.y);
		};

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);

		socket.on("beginPath", handleBeginPath);
		socket.on("drawLine", handleDrawLine);
		socket.on("drawLineCompleted", saveHistory);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", handleMouseUp);

			socket.off("beginPath", handleBeginPath);
			socket.off("drawLine", handleDrawLine);
			socket.off("drawLineCompleted", saveHistory);
		};
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d", { willReadFrequently: true });

		const changeConfig = (color, size) => {
			context.lineWidth = size;
			context.strokeStyle = color;
		};

		const handleChangeConfig = (config) => {
			changeConfig(config.color, config.size);
		};

		changeConfig(color, size);
		socket.on("changeConfig", handleChangeConfig);

		return () => {
			socket.off("changeConfig", handleChangeConfig);
		};
	}, [color, size]);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d", { willReadFrequently: true });

		if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
			const URL = canvas.toDataURL();
			const anchor = document.createElement("a");
			anchor.href = URL;
			anchor.download = "sketch.jpg";
			anchor.click();
		} else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
			if (historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO)
				historyPointer.current -= 1;

			if (
				historyPointer.current < drawHistory.current.length - 1 &&
				actionMenuItem === MENU_ITEMS.REDO
			)
				historyPointer.current += 1;

			const imageData = drawHistory.current[historyPointer.current];
			context.putImageData(imageData, 0, 0);
		}

		dispatch(actionItemClick(null));
	}, [actionMenuItem, dispatch]);

	return <canvas ref={canvasRef}></canvas>;
};

export default Board;
