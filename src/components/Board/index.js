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
		};

		canvas.addEventListener("mousedown", handleMouseDown);
		canvas.addEventListener("mousemove", handleMouseMove);
		canvas.addEventListener("mouseup", handleMouseUp);
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
		}

		dispatch(actionItemClick(null));
	}, [actionMenuItem, dispatch]);

	return <canvas ref={canvasRef}></canvas>;
};

export default Board;
