import { menuItemClick } from "@/store/slices/menuSlice";
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

import styles from "./index.module.css";

const Menu = () => {
	const dispatch = useDispatch();
	const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);

	const handleMenuClick = (menuName) => {
		dispatch(menuItemClick(menuName));
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
			<div className={styles.iconWrapper}>
				<FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
			</div>
			<div className={styles.iconWrapper}>
				<FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
			</div>
			<div className={styles.iconWrapper}>
				<FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
			</div>
		</div>
	);
};

export default Menu;
