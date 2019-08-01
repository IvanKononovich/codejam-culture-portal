import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from '@material-ui/core';
import MediaQuery from 'react-responsive';

import styles from './GlobalNavStyles';
import PortalDescription from '../HomePage/PortalDescription';
import Developers from '../DevelopersPage/Developers';
import Architect from '../ArchitectPage/Architect';
import SearchByArchitects from '../ArchitectPage/SearchByArchitects';
import LanguageController from '../Language/LanguageController';
import MobileMenu from './MobileMenu';

import storeRU from '../../store/storeRU';
import storeBY from '../../store/storeBY';
import storeEN from '../../store/storeEN';

class GlobalNav extends Component {
    state = {
        allDataLanguage: [
            {
                name: 'ru',
                data: storeRU,
            },
            {
                name: 'by',
                data: storeBY,
            },
            {
                name: 'en',
                data: storeEN,
            },
        ],
        language: 'ru',
        activeStore: storeRU,
        anchorEl: null,
        anchorMenuEl: null,
        URLPath: '/codejam-culture-portal',
    };

    findAllName(obj, listCategory) {
        const names = [];

        obj.forEach((item, index) => {
            const configItem = { index };

            listCategory.forEach((category) => {
                configItem[category] = item[category];
            });

            names.push(configItem);
        });

        return names;
    }

    createRouters(listLink, data, componentCb) {
        const routers = [];

        listLink.forEach((item, index) => {
            const props = data[item.index];
            props.URLPath = this.state.URLPath;

            routers.push(
                <Route exact
                    key={item.url}
                    path={`${this.state.URLPath}/${item.url}`}
                    render={() => componentCb(props)}
                />
            )
        });

        return routers;
    }

    handleClick = (event) => {
        const { target } = event;
        const { language } = target.dataset;

        if (this.state.language !== language) {
            this.dataSearchForActiveLanguage(language);
        }

        this.setState({
            anchorEl: null,
            anchorMenuEl: null
        })
    }

    dataSearchForActiveLanguage(newLanguage) {
        const data = this.state.allDataLanguage;

        data.forEach((item) => {
            if (item.name === newLanguage) {
                const newStore = item.data;

                this.setState({
                    activeStore: newStore,
                    language: newLanguage,
                });
            }
        });
    }

    handleMainMenu = e => {
        this.setState({
            anchorMenuEl: e.currentTarget
        })
    }

    handleMainClose = () => {
        this.setState({
            anchorMenuEl: null
        })
    }

    handleMenu = e => {
        this.setState({
            anchorEl: e.currentTarget
        })
    }

    handleClose = () => {
        this.setState({
            anchorEl: null
        })
    }

    render() {
        const routers = [];
        const {
            activeStore: {
                architects, developersList, architectsNav, homePageLink,
                developers, portalDescription, architectPageLanguage, searchLabel
            },
            anchorEl,
            anchorMenuEl,
            URLPath,
        } = this.state;

        const linksArchitects = this.findAllName(architects, ['url', 'name']);
        routers.push(...this.createRouters(
            linksArchitects,
            architects,
            (architect) => <Architect {...architect} lang={architectPageLanguage} />
        ));

        const open = Boolean(anchorEl);
        const openMenu = Boolean(anchorMenuEl);

        return (
            <>
                <Router>
                    <AppBar position="sticky">
                        <Toolbar style={styles.menuBar}>
                            <MediaQuery query="(max-device-width: 600px)">
                                <MobileMenu
                                    handleMainMenu={this.handleMainMenu}
                                    anchorMenuEl={anchorMenuEl}
                                    openMenu={openMenu}
                                    handleMainClose={this.handleMainClose}
                                    handleClick={this.handleClick}
                                    homePageLink={homePageLink}
                                    architectsNav={architectsNav}
                                    developersList={developersList}
                                    URLPath={URLPath}
                                />
                            </MediaQuery>

                            <MediaQuery query="(min-device-width: 600px)">
                                <div style={styles.linkContainer}>
                                    <Button style={styles.linkBox}>
                                        <Link style={styles.link} to={`${URLPath}/`}>
                                            {homePageLink}
                                        </Link>
                                    </Button>
                                    <Button style={styles.linkBox}>
                                        <Link style={styles.link} to={`${URLPath}/architects`}>
                                            {architectsNav}
                                        </Link>
                                    </Button>
                                    <Button style={styles.linkBox}>
                                        <Link style={styles.link} to={`${URLPath}/developers`}>
                                            {developersList}
                                        </Link>
                                    </Button>
                                </div>
                            </MediaQuery>

                            <LanguageController
                                open={open}
                                anchorEl={anchorEl}
                                handleClose={this.handleClose}
                                handleMenu={this.handleMenu}
                                onClick={this.handleClick}
                            />
                        </Toolbar>
                    </AppBar>

                    <Route exact
                        path={`${URLPath}/`}
                        render={() =>
                            <PortalDescription
                                portalDescription={portalDescription}
                                architects={architects}
                            />}
                    />
                    <Route exact
                        path={`${URLPath}/architects`}
                        render={() => (
                            <SearchByArchitects
                                architects={architects}
                                searchPlaceholder={searchLabel}
                            />)}
                    />
                    <Route exact
                        path={`${URLPath}/developers`}
                        render={() => <Developers developers={developers} />}
                    />
                    {routers}
                </Router>
            </>
        )
    }
}

export default GlobalNav;
