use 5.40.0;
use strict;
use warnings;
package Game::Evony::GeneralPair;

# ABSTRACT: Game::Evony support for handling Generals as a pair instead of as individuals

use Moo;
use Types::Standard qw( Str Int Enum ArrayRef InstanceOf );
use Type::Params qw( signature );
use namespace::autoclean;

=head1 SYNOPSIS

In Evony, most generals are most usefully evaluated as part of a pair,
not as a stand-alone general.

=cut

=attr primary

The primary general of the pair

=cut

has 'primary' => (
  is  => 'rw',
  isa => InstanceOf[ 'Games::Evony::General' ],
);

=attr secondary

The secondary general of the pair

=cut

has 'secondary' => (
  is  => 'rw',
  isa => InstanceOf[ 'Games::Evony::General' ],
);


1;
