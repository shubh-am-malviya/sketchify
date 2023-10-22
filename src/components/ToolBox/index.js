import { socket } from "@/socket";
import { changeBrushSize, changeColor } from "@/store/slices/toolboxSlice";
import { COLORS, MENU_ITEMS } from "@/utils/constant";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import classes from "./index.module.css";

const ToolBox = () => {
	const dispatch = useDispatch();
	const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
	const { color, size } = useSelector((state) => state.toolBox[activeMenuItem]);

	const isEraserEnable = activeMenuItem === MENU_ITEMS.ERASER;
	const showStrokeToolOption = activeMenuItem === MENU_ITEMS.PENCIL;
	const showBrushToolOption =
		activeMenuItem === MENU_ITEMS.PENCIL || activeMenuItem === MENU_ITEMS.ERASER;

	const updateBrushSize = (e) => {
		dispatch(changeBrushSize({ item: activeMenuItem, size: e.target.value }));
		socket.emit("changeConfig", { color, size: e.target.value });
	};

	const updateColor = (newColor) => {
		dispatch(changeColor({ item: activeMenuItem, color: newColor }));
		socket.emit("changeConfig", { color: newColor, size });
	};

	return (
		<div className={classes.toolboxContainer}>
			{showStrokeToolOption && (
				<div className={classes.toolItem}>
					<h4 className={classes.toolText}>Stoke Color</h4>
					<div className={classes.itemContainer}>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.BLACK })}
							style={{ backgroundColor: COLORS.BLACK }}
							onClick={() => updateColor(COLORS.BLACK)}
						/>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.BLUE })}
							style={{ backgroundColor: COLORS.BLUE }}
							onClick={() => updateColor(COLORS.BLUE)}
						/>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.GREEN })}
							style={{ backgroundColor: COLORS.GREEN }}
							onClick={() => updateColor(COLORS.GREEN)}
						/>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.ORANGE })}
							style={{ backgroundColor: COLORS.ORANGE }}
							onClick={() => updateColor(COLORS.ORANGE)}
						/>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.RED })}
							style={{ backgroundColor: COLORS.RED }}
							onClick={() => updateColor(COLORS.RED)}
						/>
						<div
							className={cx(classes.colorBox, { [classes.active]: color === COLORS.YELLOW })}
							style={{ backgroundColor: COLORS.YELLOW }}
							onClick={() => updateColor(COLORS.YELLOW)}
						/>
					</div>
				</div>
			)}
			{showBrushToolOption && (
				<div className={classes.toolItem}>
					<h4 className={classes.toolText}>{isEraserEnable ? "Eraser " : "Brush"} Size</h4>
					<div className={classes.itemContainer}>
						<input
							type="range"
							value={size}
							min={isEraserEnable ? 2 : 1}
							max={isEraserEnable ? 30 : 10}
							step={isEraserEnable ? 2 : 1}
							onChange={updateBrushSize}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default ToolBox;
