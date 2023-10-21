import { COLORS } from "@/utils/constant";
import classes from "./index.module.css";
const ToolBox = () => {
	const updateBrushSize = () => {};

	return (
		<div className={classes.toolboxContainer}>
			<div className={classes.toolItem}>
				<h4 className={classes.toolText}>Stoke Color</h4>
				<div className={classes.itemContainer}>
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.BLACK }} />
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.BLUE }} />
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.GREEN }} />
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.ORANGE }} />
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.RED }} />
					<div className={classes.colorBox} style={{ backgroundColor: COLORS.YELLOW }} />
				</div>
			</div>
			<div className={classes.toolItem}>
				<h4 className={classes.toolText}>Brush Size</h4>
				<div className={classes.itemContainer}>
					<input type="range" min={1} max={10} step={1} onChange={updateBrushSize} />
				</div>
			</div>
		</div>
	);
};

export default ToolBox;
