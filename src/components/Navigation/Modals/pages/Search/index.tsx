import React, { useContext, useState } from 'react';

import {
    Props,
    ModalContent,
    ContentContainer
} from './styles';

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@components/shadcn-ui/ui/table"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/shadcn-ui/ui/avatar"
import styled, { ThemeContext } from 'styled-components';
import { Game } from '@/types';
import Modals from '../..';

const SearchModal: React.FC<Props> = ({ data }) => {
  const theme = useContext(ThemeContext);
  const [selectedGame, setSelectedGame] = useState<Game>();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);

  const handleOpenModal = (modalName: string) => {
    setSelectedModal(modalName);
  };

  const handleCloseModal = () => {
    setSelectedModal(null);
  };

  return (
    <ModalContent>
      <ContentContainer style={{justifyContent: 'flex-start'}}>
        <Table style={{marginBottom: '30px'}}>
          <TableBody>
            {data.results.map((game) => (
              <StyledTableRow onClick={() => {
                setSelectedGame(game);
                handleOpenModal("game");
              }} key={game.id}>
                <TableCell>
                  <img className="w-24 h-16 object-cover rounded-lg mx-auto" src={game.background_image} alt='-'/>
                </TableCell>
                <TableCell>{game.name}</TableCell>
                <TableCell>{game.rating}</TableCell>
                <TableCell className="text-right">{game.updated}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </ContentContainer>
      <Modals
        setModal={selectedModal}
        closeModal={handleCloseModal}
        modalName={selectedGame?.name || ""}
        data={selectedGame?.id}
      />
    </ModalContent>
  );
};

export default SearchModal;

const StyledTableRow = styled(TableRow)`
  background-color: ${props => props.theme.colors.background_4};

  &:hover {
    background-color: ${props => props.theme.colors.background_6};
  }
`
