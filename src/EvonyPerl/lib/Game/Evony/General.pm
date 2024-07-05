use 5.40.0;
use strict;
use warnings;
package Game::Evony::General;
# ABSTRACT: Helper methods for Evony TKR Generals

use strictures 2;
use Types::Standard qw( Str Int Enum ArrayRef Object );
use Type::Params -sigs;

use Moo;
use Moo::Role;

use namespace::autoclean;


=head1 SYNOPSIS

Read in Evony TRK Generals as YAML, write them out as mdx files,
create data structures usable by other modules within the Game::Evony
namespace.

=head1 EXPORT

A list of functions that can be exported.  You can delete this section
if you don't export anything, such as for a purely object-oriented module.

=attr name

The name of the Evony General represented as a string.
Once set, this should not be changed (Moo should enforce
that it cannot be changed).

=cut

has 'name' => (
  is => 'ro',
  isa => 'Str',
);

1;
