import { h, render } from 'preact';
import ReconnectingWebSocket from 'reconnecting-websocket';
import clearNode from './util/clear-node';

import './overrides.scss';
import SidebarSection from './SidebarSection.jsx';
import PrinterFooter from './PrinterFooter.jsx';

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementsByClassName('graphicheader')[0];
    const headerLink = clearNode(header.getElementsByTagName('a')[0]);
    render(<div className="header-image" />, clearNode(headerLink));

    const sidebar = document.getElementById('secnav');
    const hoursTitle = clearNode(sidebar.getElementsByTagName('h4')[1]);
    render(<span>Schedule</span>, hoursTitle);

    const sidebarWidget = clearNode(
        sidebar.getElementsByClassName('textwidget')[1]
    );

    let state = {};

    const renderSidebar = () => {
        render(
            <SidebarSection {...state} />,
            sidebarWidget,
            sidebarWidget.lastChild
        );
    };
    renderSidebar();

    const signSocket = new ReconnectingWebSocket('wss://ds-sign.yunyul.in');
    signSocket.onmessage = ({ data }) => {
        state = { ...state, signData: JSON.parse(data) };
        renderSidebar();
    };

    const navbar = document.getElementById('sitenav');
    if (navbar.firstChild.classList.contains('current_page_item')) {
        const contentSection = document.getElementById('seccontent');
        const mainSection = contentSection.getElementsByClassName('secmain')[0];
        const printerFooter = mainSection.appendChild(<div></div>);

        const renderFooter = () => {
            render(<PrinterFooter {...state} />, main, printerFooter);
        };
        renderFooter();

        const printerSocket = new ReconnectingWebSocket(
            'wss://iot.vanderbilt.design'
        );
        printerSocket.onmessage = ({ data }) => {
            state = { ...state, printerData: JSON.parse(data) };
            renderFooter();
        };
    }
});
