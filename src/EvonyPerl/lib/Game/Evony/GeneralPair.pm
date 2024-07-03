package Game::Evony::GeneralPair;

use 5.40.0;
use strict;
use warnings;
use Moo;
use Types::Standard qw( Str Int Enum ArrayRef InstanceOf );
use Type::Params qw( signature );
use namespace::autoclean;

=head1 SYNOPSIS

In Evony, most generals are most usefully evaluated as part of a pair,
not as a stand-alone general.

=head1 EXPORT

A list of functions that can be exported.  You can delete this section
if you don't export anything, such as for a purely object-oriented module.

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


1; # End of Game::Evony::GeneralPair
