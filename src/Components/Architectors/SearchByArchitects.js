import React, { Component } from 'react';

import ArchitectNav from './ArchitectNav';
import { architects } from '../../store';   

class SearchByArchitects extends Component {
    state = {
        searchResults: architects,
        input: () => <input onChange={(event) => this.handleChange(event)} type="text"/>
    }

    findArchitects(searchText) {
        const matches = [];
        const regExp = new RegExp(searchText, 'gi');

        architects.forEach((item) => {
            const criteria = [
                item.name,
                item.placeOfBirth,
                item.placeOfResidence,
            ] 
            let fit = false;

            criteria.forEach((text) => {
                if (text.search(regExp) >= 0) {
                    fit = true;
                }
            });

            if (fit) {
                matches.push(item);
            }
        });

        return matches;
    }

    handleChange(event) {
        const searchText = event.target.value;

        const searchResults = this.findArchitects(searchText);

        this.setState({
            searchResults,
        });
    }

    render() {
        return <>
            { this.state.input() }
            <ArchitectNav links={this.state.searchResults} />
        </>
    }
}

export default SearchByArchitects;