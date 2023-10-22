import { actionItemClick, menuItemClick } from "@/store/slices/menuSlice";
import { MENU_ITEMS } from "@/utils/constant";
import {
	faEraser,
	faFileArrowDown,
	faPencil,
	faRotateLeft,
	faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "@/socket";
import { useEffect } from "react";
import styles from "./index.module.css";

const Menu = () => {
	const dispatch = useDispatch();
	const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

	useEffect(() => {
		socket.on("actionClick", (arg) => {
			arg.actionName !== MENU_ITEMS.DOWNLOAD && dispatch(actionItemClick(arg.actionName));
		});
		return () => {
			socket.off("actionClick");
		};
	}, [dispatch]);

	const handleMenuClick = (menuName) => {
		dispatch(menuItemClick(menuName));
	};

	const handleActionClick = (actionName) => {
		dispatch(actionItemClick(actionName));
		socket.emit("actionClick", { actionName });
	};

	return (
		<div className={styles.menuContainer}>
			<div
				className={cx(styles.iconWrapper, {
					[styles.active]: activeMenuItem === MENU_ITEMS.PENCIL,
				})}
				onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}
			>
				<FontAwesomeIcon icon={faPencil} className={styles.icon} />
			</div>
			<div
				className={cx(styles.iconWrapper, {
					[styles.active]: activeMenuItem === MENU_ITEMS.ERASER,
				})}
				onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}
			>
				<FontAwesomeIcon icon={faEraser} className={styles.icon} />
			</div>
			<div className={styles.iconWrapper} onClick={() => handleActionClick(MENU_ITEMS.UNDO)}>
				<FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
			</div>
			<div className={styles.iconWrapper} onClick={() => handleActionClick(MENU_ITEMS.REDO)}>
				<FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
			</div>
			<div className={styles.iconWrapper} onClick={() => handleActionClick(MENU_ITEMS.DOWNLOAD)}>
				<FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
			</div>
		</div>
	);
};

export default Menu;
