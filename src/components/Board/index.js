import { actionItemClick } from "@/store/slices/menuSlice";
import { MENU_ITEMS } from "@/utils/constant";
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
		const context = canvas.getContext("2d");

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const beginPath = (x, y) => {
			context.beginPath();
			context.moveTo(x, y);
		};

		const drawLine = (x, y) => {
			context.lineTo(x, y);
			context.stroke();
		};

		const handleMouseDown = (e) => {
			shouldDraw.current = true;
			beginPath(e.clientX, e.clientY);
		};

		const handleMouseMove = (e) => {
			if (!shouldDraw.current) return;
			drawLine(e.clientX, e.clientY);
		};

		const handleMouseUp = () => {
			shouldDraw.current = false;
			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			drawHistory.current.push(imageData);
			historyPointer.current = drawHistory.current.length - 1;
			console.log(historyPointer.current);
		};

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);

		return () => {
			canvas.removeEventListener("mousedown", handleMouseDown);
			canvas.removeEventListener("mousemove", handleMouseMove);
			canvas.removeEventListener("mouseup", handleMouseUp);
		};
	}, []);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

		const config = () => {
			context.lineWidth = size;
			context.strokeStyle = color;
		};

		config();
	}, [color, size]);

	useEffect(() => {
		if (!canvasRef.current) return;
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");

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
			console.log(historyPointer.current);
		}

		dispatch(actionItemClick(null));
	}, [actionMenuItem, dispatch]);

	return <canvas ref={canvasRef}></canvas>;
};

export default Board;
